import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { StoreRpcError } from '@app/store-contracts';
import { ValueTransformer } from 'typeorm';

// Erreur métier transmise à la gateway, qui la convertit en réponse HTTP.
export function fail(statusCode: HttpStatus, message: string): never {
    throw new RpcException({ statusCode, message } satisfies StoreRpcError);
}

// Postgres renvoie les colonnes numeric en string : on les convertit en number.
export const numeric: ValueTransformer = {
    to: (value?: number | null) => value,
    from: (value?: string | null) => (value === null || value === undefined ? null : Number(value)),
};

export const money = (value: number) => Math.round(value * 100) / 100;

export function slugify(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

export interface StoreSettings {
    currency: string;
    cities: string[];
    shippingFee: number;
    freeShippingFrom: number;
}

export function loadSettings(env: NodeJS.ProcessEnv = process.env): StoreSettings {
    return {
        currency: env.STORE_CURRENCY || 'USD',
        cities: (env.STORE_CITIES || 'Goma,Bukavu,Uvira').split(',').map((c) => c.trim()).filter(Boolean),
        shippingFee: Number(env.STORE_SHIPPING_FEE ?? 5),
        freeShippingFrom: Number(env.STORE_FREE_SHIPPING_FROM ?? 300),
    };
}

export function shippingFeeFor(subtotal: number, settings: StoreSettings): number {
    return subtotal === 0 || subtotal >= settings.freeShippingFrom ? 0 : settings.shippingFee;
}
