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
import { JwtService } from '@nestjs/jwt';
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

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly jwtService: JwtService,
  ) {}

  private emitOnlineUsers() {
    this.io.emit('online-users', Array.from(this.onlineUsers));
  }

  handleConnection(client: Socket) {
    const token =
      (client.handshake.auth?.token as string) ||
      (client.handshake.query.token as string);

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId = String(payload.sub);
      client.data.userId = userId;
      this.onlineUsers.add(userId);
      this.emitOnlineUsers();
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.onlineUsers.delete(userId);
      this.emitOnlineUsers();
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createConversationDto: CreateConversationDto,
  ) {
    const userId = Number(client.data.userId);
    const conversation = await this.conversationsService.createConversation(
      userId,
      createConversationDto,
    );

    client.emit('conversation', conversation);
    this.io.emit('receiveMessage', conversation);
  }

  @SubscribeMessage('user-online')
  handleUserOnline(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.onlineUsers.add(userId);
      this.emitOnlineUsers();
    }
  }

  @SubscribeMessage('user-offline')
  handleUserOffline(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.onlineUsers.delete(userId);
      this.emitOnlineUsers();
    }
  }
}
