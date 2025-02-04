import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const existingUsers = await connection.getRepository(User).find();
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
          id: 7,
          firstName: 'Patrick',
          lastName: 'Eriga',
          phoneNumber: '+256705999237',
          role: 'admin',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 8,
          firstName: 'Sarah',
          lastName: 'Johnson',
          phoneNumber: '+256705999238',
          role: 'youth',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 9,
          firstName: 'Michael',
          lastName: 'Brown',
          phoneNumber: '+256705999239',
          role: 'mentor',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 10,
          firstName: 'Emily',
          lastName: 'Davis',
          phoneNumber: '+256705999240',
          role: 'employer',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 11,
          firstName: 'David',
          lastName: 'Miller',
          phoneNumber: '+256705999241',
          role: 'youth',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 12,
          firstName: 'Olivia',
          lastName: 'Wilson',
          phoneNumber: '+256705999242',
          role: 'mentor',
          password: hashedPassword,
          isOnboarded: false,
        },
        {
          id: 13,
          firstName: 'Sophia',
          lastName: 'Taylor',
          phoneNumber: '+256705999243',
          role: 'employer',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 14,
          firstName: 'Jordan',
          lastName: 'Lulu',
          phoneNumber: '+256705999244',
          role: 'youth',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 15,
          firstName: 'Ethan',
          lastName: 'Harris',
          phoneNumber: '+256705999245',
          role: 'employer',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 16,
          firstName: 'Mia',
          lastName: 'Clark',
          phoneNumber: '+256705999246',
          role: 'mentor',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 17,
          firstName: 'Lucas',
          lastName: 'Martinez',
          phoneNumber: '+256705999247',
          role: 'youth',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 18,
          firstName: 'Ava',
          lastName: 'Lee',
          phoneNumber: '+256705999248',
          role: 'mentor',
          password: hashedPassword,
          isOnboarded: false,
        },
        {
          id: 19,
          firstName: 'Mason',
          lastName: 'Perez',
          phoneNumber: '+256705999249',
          role: 'youth',
          password: hashedPassword,
          isOnboarded: true,
        },
        {
          id: 20,
          firstName: 'Freda',
          lastName: 'Bella',
          phoneNumber: '+256705999250',
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
