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
          phoneNumber: '+256705999231',
          role: 'youth',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          phoneNumber: '+256705999232',
          role: 'mentor',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 3,
          firstName: 'Alice',
          lastName: 'Johnson',
          phoneNumber: '+256705999233',
          role: 'employer',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 4,
          firstName: 'Bob',
          lastName: 'Brown',
          phoneNumber: '+256705999234',
          role: 'youth',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 5,
          firstName: 'Rick',
          lastName: 'Owens',
          phoneNumber: '+256705999235',
          role: 'employer',
          password: hashedPassword,
          isOnboarded: false,
        },
        {
          id: 6,
          firstName: 'Bobby',
          lastName: 'Axelrod',
          phoneNumber: '+256705999236',
          role: 'mentor',
          password: hashedPassword,
          isOnboarded: false,
        },
        {
          id: 6,
          firstName: 'Patrick',
          lastName: 'Eriga',
          phoneNumber: '+256705999237',
          role: 'admin',
          password: hashedPassword,
          isOnboarded: true,
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
