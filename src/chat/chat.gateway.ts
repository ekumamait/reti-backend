import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationsService } from '../conversations/conversations.service';
import { CreateConversationDto } from '../conversations/dto/create-conversation.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || process.env.LOCAL_FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() io: Server;
  constructor(private readonly conversationsService: ConversationsService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    client.data.userId = userId;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createConversationDto: CreateConversationDto,
  ) {
    const userId = client.data.userId;
    const conversation = await this.conversationsService.createConversation(
      userId,
      createConversationDto,
    );
    client.emit('conversation', conversation);
    this.io.emit('receiveMessage', conversation);
  }
}
