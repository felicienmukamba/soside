import { Controller } from '@nestjs/common';
import { BlogServiceService } from './blog-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePostDto } from './dto/create-post.dto';

@Controller()
export class BlogServiceController {
  constructor(private readonly blogService: BlogServiceService) { }

  @MessagePattern('create_post')
  create(@Payload() createPostDto: CreatePostDto) {
    return this.blogService.create(createPostDto);
  }

  @MessagePattern('find_all_posts')
  findAll() {
    return this.blogService.findAll();
  }

  @MessagePattern('find_post_by_id')
  findOne(@Payload() id: string) {
    return this.blogService.findOne(id);
  }

  @MessagePattern('create_comment')
  createComment(@Payload() data: { postId: string; authorId: string; content: string }) {
    return this.blogService.createComment(data.postId, data.authorId, data.content);
  }

  @MessagePattern('get_comments_by_post')
  getCommentsByPost(@Payload() postId: string) {
    return this.blogService.getCommentsByPost(postId);
  }

  @MessagePattern('delete_comment')
  deleteComment(@Payload() id: string) {
    return this.blogService.deleteComment(id);
  }
}
