import { User } from '@/entities/User';
import { Factory, times } from 'typeorm-seeding';

export default class UserFactory {
  public async make(data: Partial<User>): Promise<User> {
    return {
      name: data.name || 'Default Name',
      email: data.email || 'default@example.com',
      // Add other fields as necessary
    } as User;
  }
}
