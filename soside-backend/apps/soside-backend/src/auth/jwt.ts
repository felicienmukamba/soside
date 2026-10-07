import { CanActivate, createParamDecorator, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

// Même secret que auth-service, qui signe les jetons : { sub, email, role }.
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthUser {
    id: string;
    email: string;
    role: string;
}

interface TokenPayload extends jwt.JwtPayload {
    sub: string;
    email: string;
    role: string;
    purpose?: string;
}

function readUser(request: { headers: Record<string, string | undefined> }): AuthUser | undefined {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) return undefined;
    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET) as TokenPayload;
        // Un jeton intermédiaire (étape 2FA) n'ouvre pas de session.
        if (payload.purpose) throw new Error('not a session token');
        return { id: payload.sub, email: payload.email, role: payload.role };
    } catch {
        throw new UnauthorizedException('Session expirée, reconnectez-vous');
    }
}

// Accepte les visiteurs anonymes, mais identifie le client si un jeton est fourni.
@Injectable()
export class OptionalAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        request.user = readUser(request);
        return true;
    }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        request.user = readUser(request);
        if (!request.user) throw new UnauthorizedException('Connexion requise');
        return true;
    }
}

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        request.user = readUser(request);
        if (!request.user) throw new UnauthorizedException('Connexion requise');
        if (request.user.role !== 'admin') throw new ForbiddenException('Accès réservé aux administrateurs');
        return true;
    }
}

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext): AuthUser | undefined => {
    return context.switchToHttp().getRequest().user;
});

// Jeton court délivré après le mot de passe quand la 2FA est active : il prouve que la première étape a réussi.
export function signTwoFactorTicket(userId: string): string {
    return jwt.sign({ sub: userId, purpose: '2fa' }, JWT_SECRET, { expiresIn: '5m' });
}

export function readTwoFactorTicket(ticket: string): string {
    try {
        const payload = jwt.verify(ticket, JWT_SECRET) as TokenPayload;
        if (payload.purpose !== '2fa') throw new Error('wrong purpose');
        return payload.sub;
    } catch {
        throw new UnauthorizedException('Étape de vérification expirée, reconnectez-vous');
    }
}
