import { Module } from '@nestjs/common';
import { CommunityServiceController } from './community-service.controller';
import { CommunityServiceService } from './community-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './chapter.entity';
import { Event } from './event.entity';
import { Channel } from './channel.entity';
import { Message } from './message.entity';

export const COMMUNITY_ENTITIES = [Chapter, Event, Channel, Message];

// Contrôleurs et services sans connexion : réutilisés par la gateway en mode monolithe (Vercel).
@Module({
  imports: [TypeOrmModule.forFeature(COMMUNITY_ENTITIES)],
  controllers: [CommunityServiceController],
  providers: [CommunityServiceService],
  exports: [TypeOrmModule],
})
export class CommunityCoreModule { }
