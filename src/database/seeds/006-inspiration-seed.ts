import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Inspiration } from '../entities/inspiration.entity';
import { User } from '../entities/user.entity';

export default class CreateInspirations implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const existingInspirations = await connection
      .getRepository(Inspiration)
      .find();

    // Fetch the mentor users
    const mentors = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'mentor' })
      .getMany();

    if (mentors.length === 0) {
      throw new Error('No mentors found');
    }

    if (existingInspirations.length === 0) {
      const inspirations = [
        {
          content: 'Content for inspiration 1',
          mentor: mentors[0],
          likes: 10,
          imageUrl:
            'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          content: 'Content for inspiration 2',
          mentor: mentors[1],
          likes: 0,
          imageUrl:
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        },
        {
          content:
            'Step by step. “Take care of your body. It’s the only place you have to live. The body is a reflection of your thoughts and beliefs. Choose positivity. The body is a sacred garment. It’s your first and last garment; it is what you enter life in and what you depart life with, and it should be treated with honor.”',
          mentor: mentors[1],
          likes: 2,
          imageUrl:
            'https://images.unsplash.com/photo-1519032284022-0fdfbdb3c42e?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          content:
            'Life is like a box of chocolates. You never know what you\nre gonna get.',
          mentor: mentors[1],
          likes: 0,
          imageUrl:
            'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          content:
            '"When you want something, all the universe conspires in helping you to achieve it". ',
          mentor: mentors[5],
          likes: 2,
        },
      ];

      await connection
        .createQueryBuilder()
        .insert()
        .into(Inspiration)
        .values(inspirations)
        .execute();
    }
  }
}
