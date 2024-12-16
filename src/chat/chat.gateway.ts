import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() io: Server;

  constructor(private readonly conversationsService: ConversationsService) {}

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;

    // Retrieve user ID from query parameters
    const userId = client.handshake.query.userId;
    client.data.userId = userId;

    this.logger.log(
      `Client id: ${client.id} connected with user ID: ${client.data.userId}`,
    );
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id: ${client.id} disconnected`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createConversationDto: CreateConversationDto,
  ) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${JSON.stringify(createConversationDto)}`);

    const userId = client.data.userId;

    const conversation = await this.conversationsService.createConversation(
      userId,
      createConversationDto,
    );

    this.io.emit('receiveMessage', conversation);
  }
}
