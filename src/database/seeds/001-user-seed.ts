import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../entities/user.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const users: Partial<User>[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'youth',
        password: 'password123', // Use a hashed password in production
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        role: 'mentor',
        password: 'password123', // Use a hashed password in production
      },
      {
        id: 3,
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        role: 'employer',
        password: 'password123', // Use a hashed password in production
      },
      {
        id: 4,
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bob.brown@example.com',
        role: 'youth',
        password: 'password123', // Use a hashed password in production
      },
      // Add more user data as needed
    ];

    await connection.getRepository(User).clear(); // Clear existing users

    const usersSeeded = await connection.manager.find(User);
    if (usersSeeded.length === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(users)
        .execute();
    }
  }
}
