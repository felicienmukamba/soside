import { Module } from '@nestjs/common';
import { CommunityServiceController } from './community-service.controller';
import { CommunityServiceService } from './community-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './chapter.entity';
import { Event } from './event.entity';
import { Channel } from './channel.entity';
import { Message } from './message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'soside_user',
      password: process.env.DB_PASSWORD || 'soside_password',
      database: process.env.DB_NAME || 'soside_db',
      entities: [Chapter, Event, Channel, Message],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Chapter, Event, Channel, Message]),
  ],
  controllers: [CommunityServiceController],
  providers: [CommunityServiceService],
})
export class CommunityServiceModule { }
