import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { Conversation } from '../entities/conversation.entity';
import { NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/common/constants';

export default class CreateConversations implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const userRepository = connection.getRepository(User);
    const conversationRepository = connection.getRepository(Conversation);

    const conversationsData = [
      { user1id: 1, user2id: 2 },
      { user1id: 1, user2id: 3 },
    ];

    for (const { user1id, user2id } of conversationsData) {
      const user1 = await userRepository.findOne({ where: { id: user1id } });
      const user2 = await userRepository.findOne({ where: { id: user2id } });

      if (!user1 || !user2) {
        throw new NotFoundException(ERROR_MESSAGES.PARTICIPANTS_NOT_FOUND);
      }

      const conversation = new Conversation();
      conversation.user1 = user1;
      conversation.user2 = user2;

      await conversationRepository.save(conversation);
    }
  }
}
