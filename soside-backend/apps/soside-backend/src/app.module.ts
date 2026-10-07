import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProjectServiceController } from './controllers/project.controller';
import { BlogServiceController } from './controllers/blog.controller';
import { LearningController } from './controllers/learning.controller';
import { CommunityController } from './controllers/community.controller';
import { RecruitmentController } from './controllers/recruitment.controller';
import { UserController } from './controllers/user.controller';
import { AIController } from './controllers/ai.controller';
import { AuthController } from './controllers/auth.controller';
import { StoreController } from './controllers/store.controller';
import { StoreAdminController } from './controllers/store-admin.controller';
import { MonolithModule } from './monolith.module';
import { SERVICE_CLIENTS } from './service-clients';

const monolith = process.env.GATEWAY_MODE === 'monolith';

// Par défaut : un client Redis par microservice (docker-compose). En mode monolithe : services chargés en mémoire.
const redisClients = ClientsModule.register(
  SERVICE_CLIENTS.map((name) => ({
    name,
    transport: Transport.REDIS as const,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  })),
);

@Module({
  imports: [monolith ? MonolithModule : redisClients],
  controllers: [
    AppController,
    ProjectServiceController,
    BlogServiceController,
    LearningController,
    CommunityController,
    RecruitmentController,
    UserController,
    AIController,
    AuthController,
    StoreController,
    StoreAdminController,
  ],
  providers: [AppService],
})
export class AppModule { }
