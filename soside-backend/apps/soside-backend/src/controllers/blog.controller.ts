import { Controller, Get, Post, Body, Inject, Param, Delete, Patch } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

class CreatePostDto {
    title: string;
    content: string;
    category: string;
    isPublished?: boolean;
}

@ApiTags('blog')
@Controller('blog')
export class BlogServiceController {
    constructor(@Inject('BLOG_SERVICE') private readonly blogClient: ClientProxy) { }

    @Post()
    @ApiOperation({ summary: 'Create a new blog post' })
    create(@Body() createPostDto: CreatePostDto) {
        return this.blogClient.send('create_post', createPostDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all blog posts' })
    findAll() {
        return this.blogClient.send('find_all_posts', {});
    }

    @Get('category/:category')
    @ApiOperation({ summary: 'Get posts by category' })
    findByCategory(@Param('category') category: string) {
        return this.blogClient.send('find_posts_by_category', category);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get post by ID' })
    findOne(@Param('id') id: string) {
        return this.blogClient.send('find_post_by_id', id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a blog post' })
    update(@Param('id') id: string, @Body() updatePostDto: Partial<CreatePostDto>) {
        return this.blogClient.send('update_post', { id, postData: updatePostDto });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a blog post' })
    remove(@Param('id') id: string) {
        return this.blogClient.send('remove_post', id);
    }
}
