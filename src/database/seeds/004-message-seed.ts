import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Message } from '../../messages/entities/message.entity';
import { User } from '../entities/user.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';

export default class CreateMessages implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const userRepository = connection.getRepository(User);
    const conversationRepository = connection.getRepository(Conversation);
    const messageRepository = connection.getRepository(Message);

    const messagesData = [
      {
        senderId: 1,
        receiverId: 2,
        conversationId: 1,
        content: 'Hello, how are you?',
      },
      {
        senderId: 2,
        receiverId: 1,
        conversationId: 1,
        content: "I'm doing well, thanks!",
      },
    ];

    // Create and save messages
    for (const messageData of messagesData) {
      const sender = await userRepository.findOneBy({
        id: messageData.senderId,
      });
      const receiver = await userRepository.findOneBy({
        id: messageData.receiverId,
      });
      const conversation = await conversationRepository.findOneBy({
        id: messageData.conversationId,
      });

      if (!sender || !receiver || !conversation) {
        console.error('Error: User or conversation not found');
        continue;
      }

      const message = new Message();
      message.sender = sender;
      message.receiver = receiver;
      message.conversation = conversation;
      message.content = messageData.content;

      await messageRepository.save(message);
    }
  }
}
