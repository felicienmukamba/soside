import { HttpException, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';

const logger = new Logger('RpcCall');

// Envoie un message à un microservice et traduit son erreur ({ statusCode, message }) en réponse HTTP.
export async function rpc<T = unknown>(client: ClientProxy, pattern: string, data: unknown = {}): Promise<T> {
    try {
        return await firstValueFrom(client.send<T>(pattern, data).pipe(timeout(10_000)));
    } catch (error) {
        if (error instanceof TimeoutError) throw new ServiceUnavailableException('Service momentanément indisponible');
        const statusCode = typeof error?.statusCode === 'number' ? error.statusCode : 500;
        if (statusCode >= 500) logger.error(`${pattern} : ${JSON.stringify(error)}`);
        const message = statusCode >= 500 ? 'Erreur interne, réessayez dans un instant' : (error?.message ?? 'Requête refusée');
        throw new HttpException({ statusCode, message }, statusCode);
    }
}
