import { Module } from '@nestjs/common';
import { BlogServiceController } from './blog-service.controller';
import { BlogServiceService } from './blog-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { Comment } from './comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'soside_user',
      password: process.env.DB_PASSWORD || 'soside_password',
      database: process.env.DB_NAME || 'soside_db',
      entities: [Post, Category, Tag, Comment],
      synchronize: true, // Auto-schema sync for dev
    }),
    TypeOrmModule.forFeature([Post, Category, Tag, Comment]),
  ],
  controllers: [BlogServiceController],
  providers: [BlogServiceService],
})
export class BlogServiceModule { }
