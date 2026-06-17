import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Channel } from './channel.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/community',
})
export class CommunityGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(
    @MessageBody() data: { channelId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.channelId);
    console.log(`Client ${client.id} joined channel ${data.channelId}`);
    return { event: 'joined', data: data.channelId };
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(
    @MessageBody() data: { channelId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.channelId);
    console.log(`Client ${client.id} left channel ${data.channelId}`);
    return { event: 'left', data: data.channelId };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { channelId: string; senderId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const channel = await this.channelRepository.findOne({ where: { id: data.channelId } });
    if (!channel) {
        return { event: 'error', data: 'Channel not found' };
    }

    const message = this.messageRepository.create({
      content: data.content,
      senderId: data.senderId,
      channelId: data.channelId,
    });
    const savedMessage = await this.messageRepository.save(message);

    this.server.to(data.channelId).emit('newMessage', savedMessage);
    return { event: 'messageSent', data: savedMessage };
  }
}
