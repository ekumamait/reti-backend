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
            senderId: 1,
            receiverId: 2,
            content: 'Hello, how are you?',
            timestamp: new Date(),
            read: false,
          },
          {
            senderId: 2,
            receiverId: 1,
            content: "I'm doing well, thanks!",
            timestamp: new Date(),
            read: false,
          },
        ],
      },
      {
        messages: [
          {
            senderId: 1,
            receiverId: 3,
            content: 'Hey, are you available for a chat?',
            timestamp: new Date(),
            read: false,
          },
          {
            senderId: 3,
            receiverId: 1,
            content: 'Sure! Let me know when.',
            timestamp: new Date(),
            read: false,
          },
        ],
      },
      {
        messages: [
          {
            senderId: 2,
            receiverId: 3,
            content: 'Did you receive my last message?',
            timestamp: new Date(),
            read: false,
          },
        ],
      },
    ];

    for (const { messages } of conversationsData) {
      // Extract unique user IDs from messages
      const userIds = Array.from(
        new Set(messages.flatMap((msg) => [msg.senderId, msg.receiverId])),
      );

      // Ensure both users exist
      const users = await userRepository.findByIds(userIds);
      if (users.length !== userIds.length) {
        throw new Error('One or more users not found');
      }

      // Create a map of user IDs to user names
      const userMap = new Map(
        users.map((user) => [user.id, `${user.firstName} ${user.lastName}`]),
      );

      // Enrich messages with unique IDs, timestamps, and user names
      const detailedMessages = messages.map((message, index) => ({
        ...message,
        id: Date.now() + index, // Generate a unique id
        timestamp: message.timestamp ?? new Date(),
        read: message.read ?? false,
        sender: userMap.get(message.senderId),
        receiver: userMap.get(message.receiverId),
      }));

      // Create and save the conversation
      const conversation = new Conversation();
      conversation.messages = detailedMessages;
      await conversationRepository.save(conversation);
    }
  }
}
