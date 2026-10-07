import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { MailModule } from './mail/mail.module';
import { Permission } from './permission.entity';

export const AUTH_ENTITIES = [User, Profile, Permission];

// Contrôleurs et services sans connexion : réutilisés par la gateway en mode monolithe (Vercel).
@Module({
  imports: [TypeOrmModule.forFeature(AUTH_ENTITIES), MailModule],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthCoreModule { }
