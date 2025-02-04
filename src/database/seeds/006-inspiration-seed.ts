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
          title: 'Inspiration 1',
          content: 'Content for inspiration 1',
          mentor: mentors[0],
          likes: 10,
        },
        {
          title: 'Inspiration 2',
          content: 'Content for inspiration 2',
          mentor: mentors[1],
          likes: 0,
        },
        {
          title: 'Everyday',
          content:
            'Step by step. “Take care of your body. It’s the only place you have to live. The body is a reflection of your thoughts and beliefs. Choose positivity. The body is a sacred garment. It’s your first and last garment; it is what you enter life in and what you depart life with, and it should be treated with honor.”',
          mentor: mentors[1],
          likes: 2,
        },
        {
          title: 'Forest Gump',
          content:
            'Life is like a box of chocolates. You never know what you\nre gonna get.',
          mentor: mentors[1],
          likes: 0,
        },
        {
          title: 'Inspiration 2',
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
