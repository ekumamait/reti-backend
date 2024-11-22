import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../entities/user.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const existingUsers = await connection.getRepository(User).find();
    // Only seed if no users exist
    if (existingUsers.length === 0) {
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

      await connection.query(
        'ALTER TABLE "profile" DROP CONSTRAINT IF EXISTS "FK_profile_user"',
      );

      await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(users)
        .execute();

      await connection.query(
        'ALTER TABLE "profile" ADD CONSTRAINT "FK_profile_user" FOREIGN KEY ("userId") REFERENCES "user"("id")',
      );
    }
  }
}
