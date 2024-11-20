import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { faker } from '@faker-js/faker';

export default class UserSeed {
  public async run(repository: Repository<User>): Promise<void> {
    const users = Array.from({ length: 10 }, () => ({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(), // In real app, hash this password
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    }));

    try {
      // Create users in batch
      await repository.save(users);
      console.log(`✅ Created ${users.length} users`);
    } catch (error) {
      console.error('❌ Error seeding users:', error);
      throw error;
    }
  }
}
