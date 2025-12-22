import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './post.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { Comment } from './comment.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class BlogServiceService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) { }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create({
      title: createPostDto.title,
      slug: createPostDto.slug,
      content: createPostDto.content,
      summary: createPostDto.summary,
      coverImage: createPostDto.coverImage,
      readingTime: createPostDto.readingTime,
      authorId: createPostDto.authorId,
      isPublished: createPostDto.isPublished || false,
    });

    if (createPostDto.categoryIds && createPostDto.categoryIds.length > 0) {
      post.categories = await this.categoryRepository.findBy({
        id: In(createPostDto.categoryIds),
      });
    }

    if (createPostDto.tagIds && createPostDto.tagIds.length > 0) {
      post.tags = await this.tagRepository.findBy({
        id: In(createPostDto.tagIds),
      });
    }

    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['categories', 'tags', 'comments'] });
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['categories', 'tags', 'comments']
    });
  }

  async createComment(postId: string, authorId: string, content: string): Promise<Comment> {
    const comment = this.commentRepository.create({ postId, authorId, content });
    return this.commentRepository.save(comment);
  }

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    return this.commentRepository.find({ where: { postId } });
  }

  async deleteComment(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
