import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../entities/user.entity';
import { Conversation } from '../entities/conversation.entity';
import { NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/common/constants';

export default class CreateConversations implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const userRepository = connection.getRepository(User);
    const conversationRepository = connection.getRepository(Conversation);

    // Sample messages data for seeding conversations
    const conversationsData = [
      {
        messages: [
          {
            receiverId: 2,
            content: 'Hello, how are you?',
            isRead: false,
            id: 1,
            createdAt: new Date(),
          },
          {
            receiverId: 1,
            content: "I'm doing well, thanks!",
            isRead: false,
            id: 2,
            createdAt: new Date(),
          },
        ],
      },
      {
        messages: [
          {
            receiverId: 3,
            content: 'Hey, are you available for a chat?',
            isRead: false,
            id: 3,
            createdAt: new Date(),
          },
          {
            receiverId: 10,
            content: 'Sure! Let me know when.',
            isRead: false,
            id: 4,
            createdAt: new Date(),
          },
        ],
      },
      {
        messages: [
          {
            receiverId: 3,
            content: 'Did you receive my last message?',
            isRead: false,
            id: 5,
            createdAt: new Date(),
          },
        ],
      },
    ];

    for (const { messages } of conversationsData) {
      const userId = 1;
      const receiverId = messages[0].receiverId;

      const receiver = await userRepository.findOne({
        where: { id: receiverId },
      });
      if (!receiver) {
        throw new NotFoundException('Receiver not found');
      }

      if (userId === receiverId) {
        throw new NotFoundException(
          ERROR_MESSAGES.SENDER_RECEIVER_SAME(userId),
        );
      }

      const detailedMessages = messages.map((message, index) => ({
        ...message,
        senderId: userId,
        id: message.id ?? Date.now() + index,
        createdAt: message.createdAt ?? new Date(),
        isRead: message.isRead ?? false,
      }));

      // Create and save the conversation
      const conversation = new Conversation();
      conversation.messages = detailedMessages;
      await conversationRepository.save(conversation);
    }
  }
}
