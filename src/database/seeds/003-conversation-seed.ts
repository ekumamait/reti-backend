import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/common/constants';

export default class CreateConversations implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const userRepository = connection.getRepository(User);
    const conversationRepository = connection.getRepository(Conversation);

    const conversationsData = [
      { participantIds: [1, 2] },
      { participantIds: [1, 3] },
    ];

    for (const { participantIds } of conversationsData) {
      const participants = await userRepository.findBy({
        id: In(participantIds),
      });

      if (participants.length !== participantIds.length) {
        throw new NotFoundException(ERROR_MESSAGES.PARTICIPANTS_NOT_FOUND);
      }

      const conversation = new Conversation();
      conversation.participants = participants;

      await conversationRepository.save(conversation);
    }
  }
}
