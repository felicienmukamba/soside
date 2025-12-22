import { Controller, Get, Post, Body, Inject, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('community')
@Controller('community')
export class CommunityController {
    constructor(@Inject('COMMUNITY_SERVICE') private readonly communityClient: ClientProxy) { }

    @Get('chapters')
    @ApiOperation({ summary: 'Get all chapters' })
    findAllChapters() {
        return this.communityClient.send('find_all_chapters', {});
    }

    @Post('chapters')
    @ApiOperation({ summary: 'Create a new chapter' })
    createChapter(@Body() data: any) {
        return this.communityClient.send('create_chapter', data);
    }

    @Patch('chapters/:id')
    @ApiOperation({ summary: 'Update a chapter' })
    updateChapter(@Param('id') id: string, @Body() data: any) {
        return this.communityClient.send('update_chapter', { id, chapterData: data });
    }

    @Delete('chapters/:id')
    @ApiOperation({ summary: 'Delete a chapter' })
    removeChapter(@Param('id') id: string) {
        return this.communityClient.send('remove_chapter', id);
    }

    @Get('chapters/:chapterId/events')
    @ApiOperation({ summary: 'Get events by chapter' })
    findEvents(@Param('chapterId') chapterId: string) {
        return this.communityClient.send('find_events_by_chapter', chapterId);
    }

    @Post('events')
    @ApiOperation({ summary: 'Create a new event' })
    createEvent(@Body() data: any) {
        return this.communityClient.send('create_event', data);
    }

    @Patch('events/:id')
    @ApiOperation({ summary: 'Update an event' })
    updateEvent(@Param('id') id: string, @Body() data: any) {
        return this.communityClient.send('update_event', { id, eventData: data });
    }

    @Delete('events/:id')
    @ApiOperation({ summary: 'Delete an event' })
    removeEvent(@Param('id') id: string) {
        return this.communityClient.send('remove_event', id);
    }
}
