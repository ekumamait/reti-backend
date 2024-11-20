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
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        age: 33,
        role: 'youth',
        password: 'password123', // Use a hashed password in production
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1985-05-15'),
        gender: 'female',
        email: 'jane.smith@example.com',
        phoneNumber: '098-765-4321',
        age: 38,
        role: 'mentor',
        password: 'password123', // Use a hashed password in production
      },
      {
        id: 3,
        firstName: 'Alice',
        lastName: 'Johnson',
        dateOfBirth: new Date('1992-03-22'),
        gender: 'female',
        email: 'alice.johnson@example.com',
        phoneNumber: '555-555-5555',
        age: 31,
        role: 'employer',
        password: 'password123', // Use a hashed password in production
      },
      {
        id: 4,
        firstName: 'Bob',
        lastName: 'Brown',
        dateOfBirth: new Date('1988-07-30'),
        gender: 'male',
        email: 'bob.brown@example.com',
        phoneNumber: '444-444-4444',
        age: 35,
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
