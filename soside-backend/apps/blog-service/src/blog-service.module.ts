import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from '@app/platform';
import { BlogCoreModule, BLOG_ENTITIES } from './blog-core.module';

// Microservice autonome (Redis), avec sa propre connexion.
@Module({
  imports: [TypeOrmModule.forRoot(databaseOptions(BLOG_ENTITIES)), BlogCoreModule],
})
export class BlogServiceModule { }
