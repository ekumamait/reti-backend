import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationsService } from '../conversations/conversations.service';
import { CreateConversationDto } from '../conversations/dto/create-conversation.dto';

const allowedOrigins = [
  process.env.LOCAL_FRONTEND_URL,
  process.env.FRONTEND_URL,
  process.env.LOCAL_FRONTEND_URL_ALT,
].filter(Boolean);

@WebSocketGateway({
  cors: {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server;
  private onlineUsers = new Set<string>();

  constructor(private readonly conversationsService: ConversationsService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.data.userId = userId;
      this.onlineUsers[userId] = true;
      client.join(userId);
      this.io.emit('online-users', this.onlineUsers);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      delete this.onlineUsers[userId];
      this.io.emit('online-users', this.onlineUsers);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createConversationDto: CreateConversationDto,
  ) {
    const userId = client.data.userId;
    const receiverId = createConversationDto.messages[0]?.receiverId;

    if (!receiverId) {
      return client.emit('error', 'receiverId is missing');
    }
    const conversation = await this.conversationsService.createConversation(
      userId,
      createConversationDto,
    );

    client.emit('conversation', conversation);
    this.io
      .to(userId)
      .to(receiverId.toString())
      .emit('receiveMessage', conversation);
  }

  @SubscribeMessage('user-online')
  handleUserOnline(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.onlineUsers[userId] = true;
      client.join(userId);
      this.io.emit('online-users', this.onlineUsers);
    }
  }

  @SubscribeMessage('user-offline')
  handleUserOffline(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      delete this.onlineUsers[userId];
      client.leave(userId);
      this.io.emit('online-users', this.onlineUsers);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    client.join(data.userId);
  }
}
