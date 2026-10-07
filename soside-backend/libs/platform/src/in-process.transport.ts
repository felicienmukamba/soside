import { HttpException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PATTERN_METADATA } from '@nestjs/microservices/constants';
import { defer, isObservable, lastValueFrom, Observable } from 'rxjs';

type Handler = (data: unknown) => unknown;

// Copie JSON : reproduit exactement ce qui transiterait par Redis (dates en texte, pas de références partagées).
const serialize = <T>(value: T): T => (value === undefined ? value : JSON.parse(JSON.stringify(value)));

// Repère tous les @MessagePattern des microservices chargés dans le même processus.
@Injectable()
export class MessageHandlerRegistry implements OnModuleInit {
    private readonly logger = new Logger('InProcessTransport');
    private readonly handlers = new Map<string, Handler>();

    constructor(
        private readonly discovery: DiscoveryService,
        private readonly scanner: MetadataScanner,
    ) { }

    onModuleInit() {
        for (const wrapper of this.discovery.getControllers()) {
            const instance = wrapper.instance as Record<string, Handler> | undefined;
            if (!instance) continue;
            for (const method of this.scanner.getAllMethodNames(Object.getPrototypeOf(instance))) {
                const patterns: unknown[] | undefined = Reflect.getMetadata(PATTERN_METADATA, instance[method]);
                for (const pattern of patterns ?? []) {
                    this.handlers.set(String(pattern), instance[method].bind(instance));
                }
            }
        }
        this.logger.log(`${this.handlers.size} handlers de microservices montés en mémoire`);
    }

    async dispatch(pattern: string, data: unknown): Promise<unknown> {
        const handler = this.handlers.get(pattern);
        if (!handler) throw { statusCode: 501, message: `Aucun service ne traite « ${pattern} »` };
        try {
            let result = handler(serialize(data));
            if (isObservable(result)) result = await lastValueFrom(result);
            return serialize(await result);
        } catch (error) {
            // Même format d'erreur que le transport Redis : { statusCode, message }.
            if (error instanceof RpcException) throw error.getError();
            if (error instanceof HttpException) {
                const response = error.getResponse();
                throw { statusCode: error.getStatus(), message: typeof response === 'object' && response && 'message' in response ? response.message : error.message };
            }
            this.logger.error(`${pattern} : ${error instanceof Error ? error.stack : String(error)}`);
            throw { status: 'error', message: 'Internal server error' };
        }
    }
}

// Remplace ClientProxy (Redis) quand la gateway et les services tournent dans le même processus (Vercel).
export class InProcessClient {
    constructor(private readonly registry: MessageHandlerRegistry) { }

    send<T = unknown>(pattern: string, data: unknown): Observable<T> {
        return defer(() => this.registry.dispatch(pattern, data) as Promise<T>);
    }

    emit<T = unknown>(pattern: string, data: unknown): Observable<T> {
        return this.send<T>(pattern, data);
    }

    connect() {
        return Promise.resolve();
    }

    close() {
        return undefined;
    }
}

export function inProcessClient(name: string) {
    return {
        provide: name,
        useFactory: (registry: MessageHandlerRegistry) => new InProcessClient(registry) as unknown as ClientProxy,
        inject: [MessageHandlerRegistry],
    };
}
