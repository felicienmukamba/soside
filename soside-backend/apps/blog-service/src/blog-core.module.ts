import { Module } from '@nestjs/common';
import { BlogServiceController } from './blog-service.controller';
import { BlogServiceService } from './blog-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { Comment } from './comment.entity';

export const BLOG_ENTITIES = [Post, Category, Tag, Comment];

// Contrôleurs et services sans connexion : réutilisés par la gateway en mode monolithe (Vercel).
@Module({
  imports: [TypeOrmModule.forFeature(BLOG_ENTITIES)],
  controllers: [BlogServiceController],
  providers: [BlogServiceService],
})
export class BlogCoreModule { }
