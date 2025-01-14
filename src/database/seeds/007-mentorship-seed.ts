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

    // Fetch mentor and youth users by their roles
    const mentor = await connection
      .getRepository(User)
      .findOne({ where: { role: 'mentor' } });

    const youth = await connection
      .getRepository(User)
      .findOne({ where: { role: 'youth' } });

    if (!mentor || !youth) {
      console.error(
        'Not enough users found to assign mentors and youth. Please seed the User table first.',
      );
      return;
    }

    const sessions: Partial<MentorshipSession>[] = [
      {
        mentor: mentor,
        youth: youth,
        title: `Career Guidance Session with ${mentor.firstName}`,
        sessionDate: new Date('2025-01-01T10:00:00Z'),
        status: 'CONFIRMED',
        duration: 60, // Duration in minutes
        meetingLink: 'https://meet.google.com/abc-xyz',
        notes: 'Initial session with mentor to discuss goals and expectations.',
      },
      {
        mentor: mentor,
        youth: youth,
        title: `Technical Skills Review with ${mentor.firstName}`,
        sessionDate: new Date('2025-01-02T11:00:00Z'),
        status: 'PENDING',
        duration: 45,
        meetingLink: 'https://meet.google.com/abc-xyz',
        notes: 'Follow-up session to review progress and next steps.',
      },
      {
        mentor: mentor,
        youth: youth,
        title: `Project Planning Session with ${mentor.firstName}`,
        sessionDate: new Date('2023-02-03T12:00:00Z'),
        status: 'CANCELED',
        duration: 30,
        meetingLink: 'https://meet.google.com/abc-xyz',
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
