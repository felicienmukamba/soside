import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { StoreServiceModule } from './store-service.module';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StoreServiceModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    },
  );

  // Le service peut aussi être appelé par d'autres clients que la gateway : il valide ses entrées lui-même.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) =>
        new RpcException({
          statusCode: 400,
          message: errors.flatMap((e) => Object.values(e.constraints ?? {})),
        }),
    }),
  );

  await app.listen();
}
bootstrap();
