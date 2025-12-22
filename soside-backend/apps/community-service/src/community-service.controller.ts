import { Controller } from '@nestjs/common';
import { CommunityServiceService } from './community-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CommunityServiceController {
  constructor(private readonly communityService: CommunityServiceService) { }

  @MessagePattern('create_chapter')
  createChapter(@Payload() data: any) {
    return this.communityService.createChapter(data);
  }

  @MessagePattern('find_all_chapters')
  findAllChapters() {
    return this.communityService.findAllChapters();
  }

  @MessagePattern('create_event')
  createEvent(@Payload() data: any) {
    return this.communityService.createEvent(data);
  }

  @MessagePattern('find_events_by_chapter')
  findEventsByChapter(@Payload() chapterId: string) {
    return this.communityService.findEventsByChapter(chapterId);
  }

  @MessagePattern('create_channel')
  createChannel(@Payload() data: any) {
    return this.communityService.createChannel(data);
  }

  @MessagePattern('find_channels_by_chapter')
  findChannelsByChapter(@Payload() chapterId: string) {
    return this.communityService.findChannelsByChapter(chapterId);
  }

  @MessagePattern('create_message')
  createMessage(@Payload() data: { channelId: string; senderId: string; content: string }) {
    return this.communityService.createMessage(data.channelId, data.senderId, data.content);
  }

  @MessagePattern('get_messages_by_channel')
  getMessagesByChannel(@Payload() data: { channelId: string; limit?: number }) {
    return this.communityService.getMessagesByChannel(data.channelId, data.limit);
  }
}
