import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './chapter.entity';
import { Event } from './event.entity';
import { Channel } from './channel.entity';
import { Message } from './message.entity';

@Injectable()
export class CommunityServiceService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) { }

  // Chapter operations
  async createChapter(data: any): Promise<Chapter> {
    const chapter = this.chapterRepository.create(data);
    return this.chapterRepository.save(chapter) as any as Promise<Chapter>;
  }

  async findAllChapters(): Promise<Chapter[]> {
    return this.chapterRepository.find({ relations: ['events', 'channels'] });
  }

  // Event operations
  async createEvent(data: any): Promise<Event> {
    const event = this.eventRepository.create(data);
    return this.eventRepository.save(event) as any as Promise<Event>;
  }

  async findEventsByChapter(chapterId: string): Promise<Event[]> {
    return this.eventRepository.find({ where: { chapterId } });
  }

  // Channel operations
  async createChannel(data: any): Promise<Channel> {
    const channel = this.channelRepository.create(data);
    return this.channelRepository.save(channel) as any as Promise<Channel>;
  }

  async findChannelsByChapter(chapterId: string): Promise<Channel[]> {
    return this.channelRepository.find({ where: { chapterId } });
  }

  // Message operations
  async createMessage(channelId: string, senderId: string, content: string): Promise<Message> {
    const message = this.messageRepository.create({ channelId, senderId, content });
    return this.messageRepository.save(message) as any as Promise<Message>;
  }

  async getMessagesByChannel(channelId: string, limit: number = 50): Promise<Message[]> {
    return this.messageRepository.find({
      where: { channelId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async updateChapter(id: string, data: any): Promise<Chapter | null> {
    await this.chapterRepository.update(id, data);
    return this.chapterRepository.findOne({ where: { id } });
  }

  async deleteChapter(id: string): Promise<void> {
    await this.chapterRepository.delete(id);
  }

  async updateEvent(id: string, data: any): Promise<Event | null> {
    await this.eventRepository.update(id, data);
    return this.eventRepository.findOne({ where: { id } });
  }

  async deleteEvent(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
