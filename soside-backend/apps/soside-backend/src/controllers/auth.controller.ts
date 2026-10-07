import { Body, Controller, Get, HttpCode, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsJWT, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { CurrentUser, JwtAuthGuard, readTwoFactorTicket, signTwoFactorTicket } from '../auth/jwt';
import type { AuthUser } from '../auth/jwt';
import { rpc } from '../common/rpc';

class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password: string;

    @IsString()
    @IsOptional()
    @MaxLength(60)
    firstName?: string;

    @IsString()
    @IsOptional()
    @MaxLength(60)
    lastName?: string;
}

class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

class VerifyEmailDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 6)
    code: string;
}

class TwoFactorLoginDto {
    @IsJWT()
    ticket: string;

    @IsString()
    @Length(6, 6)
    code: string;
}

interface AuthServiceUser {
    id: string;
    passwordHash?: string;
    verificationCode?: string | null;
    twoFactorSecret?: string | null;
    [key: string]: unknown;
}

// Ne jamais renvoyer le hash du mot de passe ni les secrets au navigateur.
function publicUser(user: AuthServiceUser | null | undefined) {
    if (!user) return null;
    const { passwordHash: _hash, verificationCode: _code, twoFactorSecret: _secret, ...safe } = user;
    return safe;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) { }

    @Post('register')
    @ApiOperation({ summary: 'Create a client account (a verification code is emailed)' })
    async register(@Body() dto: RegisterDto) {
        // Le rôle n'est jamais choisi par l'utilisateur : tout nouveau compte est client.
        const result = await rpc<{ user: AuthServiceUser }>(this.authClient, 'register', { ...dto, role: 'client' });
        return { user: publicUser(result.user) };
    }

    @Post('verify-email')
    @HttpCode(200)
    @ApiOperation({ summary: 'Confirm the email address with the 6-digit code' })
    async verifyEmail(@Body() dto: VerifyEmailDto) {
        await rpc(this.authClient, 'verify_email', dto);
        return { verified: true };
    }

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Log in; returns a JWT, or a 2FA ticket when two-factor is enabled' })
    async login(@Body() dto: LoginDto) {
        const result = await rpc<{ user: AuthServiceUser; token?: string; twoFactorRequired?: boolean }>(this.authClient, 'login', dto);
        if (result.twoFactorRequired) return { twoFactorRequired: true, ticket: signTwoFactorTicket(result.user.id) };
        return { token: result.token, user: publicUser(result.user) };
    }

    @Post('login/2fa')
    @HttpCode(200)
    @ApiOperation({ summary: 'Second login step with the authenticator code' })
    async loginTwoFactor(@Body() dto: TwoFactorLoginDto) {
        const userId = readTwoFactorTicket(dto.ticket);
        const result = await rpc<{ user: AuthServiceUser; token: string }>(this.authClient, 'login_2fa', { userId, code: dto.code });
        return { token: result.token, user: publicUser(result.user) };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Current user with profile' })
    async me(@CurrentUser() user: AuthUser) {
        return publicUser(await rpc<AuthServiceUser>(this.authClient, 'get_profile', user.id));
    }
}
