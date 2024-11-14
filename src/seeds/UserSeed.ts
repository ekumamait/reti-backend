import { Factory, times } from 'typeorm-seeding';
import { User } from '../entities/User'; // Adjust the path to your User entity

export default class UserSeed {
  public async run(factory: Factory): Promise<void> {
    await factory(User)().createMany(10); // Create 10 users
  }
}
