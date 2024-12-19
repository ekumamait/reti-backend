import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { MentorshipSession } from '../entities/mentorship-session.entity';
import { User } from '../entities/user.entity';

export default class CreateMentorshipSessions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const existingMentorshipSessions = await connection
      .getRepository(MentorshipSession)
      .find();

    if (existingMentorshipSessions.length > 0) return;

    // Fetch mentors and youth users from the User table
    const [mentor, youth] = await connection
      .getRepository(User)
      .find({ take: 2 });

    if (!mentor || !youth) {
      console.error(
        'Not enough users found to assign mentors and youth. Please seed the User table first.',
      );
      return;
    }

    const sessions: Partial<MentorshipSession>[] = [
      {
        mentor,
        youth,
        sessionDate: new Date('2023-12-01T10:00:00Z'),
        status: 'CONFIRMED',
        duration: 60, // Duration in minutes
        notes: 'Initial session with mentor to discuss goals and expectations.',
      },
      {
        mentor,
        youth,
        sessionDate: new Date('2023-12-02T11:00:00Z'),
        status: 'PENDING',
        duration: 45,
        notes: 'Follow-up session to review progress and next steps.',
      },
      {
        mentor,
        youth,
        sessionDate: new Date('2023-12-03T12:00:00Z'),
        status: 'CANCELED',
        duration: 30,
        notes: 'Session was canceled due to a scheduling conflict.',
      },
    ];

    await connection
      .createQueryBuilder()
      .insert()
      .into(MentorshipSession)
      .values(sessions)
      .execute();
  }
}
