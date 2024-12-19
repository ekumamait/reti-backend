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
        // Add more inspirations as needed
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
