import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const existingUsers = await connection.getRepository(User).find();
    // Only seed if no users exist
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const users: Partial<User>[] = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'youth',
          password: hashedPassword,
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          role: 'mentor',
          password: hashedPassword,
        },
        {
          id: 3,
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice.johnson@example.com',
          role: 'employer',
          password: hashedPassword,
        },
        {
          id: 4,
          firstName: 'Bob',
          lastName: 'Brown',
          email: 'bob.brown@example.com',
          role: 'youth',
          password: hashedPassword,
        },
        {
          id: 5,
          firstName: 'Rick',
          lastName: 'owens',
          email: 'rick.brown@example.com',
          role: 'employer',
          password: hashedPassword,
        },
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
