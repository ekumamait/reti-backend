import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Notification } from '../entities/notification.entity';

export default class CreateNotifications implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const existingNotifications = await connection
      .getRepository(Notification)
      .find();

    // Only seed if no notifications exist
    if (existingNotifications.length === 0) {
      const notifications: Partial<Notification>[] = [
        {
          id: 1,
          title: 'Welcome to Reti!',
          message:
            'Thank you for joining our platform. We hope you have a great experience!',
          isRead: false,
          userId: 1, // For John Doe
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'New Mentor Available',
          message: 'A new mentor has joined your area of interest.',
          isRead: false,
          userId: 1, // For John Doe
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          title: 'Profile Update Reminder',
          message:
            'Please update your profile to help us match you with opportunities.',
          isRead: true,
          userId: 2, // For Jane Smith
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          title: 'New Job Opportunity',
          message: 'A new job matching your skills has been posted.',
          isRead: false,
          userId: 4, // For Bob Brown
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await connection
        .createQueryBuilder()
        .insert()
        .into(Notification)
        .values(notifications)
        .execute();
    }
  }
}
