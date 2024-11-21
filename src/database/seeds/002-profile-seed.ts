import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Profile } from '../entities/profile.entity';

export default class CreateProfiles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const profiles: Partial<Profile>[] = [
      {
        userId: 1, // John Doe (Youth)
        profileImage: 'https://example.com/profiles/john-doe.jpg',
        skills: ['JavaScript', 'React', 'Node.js'],
        stakeholderLinks: {
          mentors: ['jane.smith@example.com'],
          employers: ['alice.johnson@example.com'],
        },
        bio: 'Aspiring full-stack developer with a passion for web technologies.',
        location: 'San Francisco, CA',
        phoneNumber: '123-456-7890',
      },
      {
        userId: 2, // Jane Smith (Mentor)
        profileImage: 'https://example.com/profiles/jane-smith.jpg',
        skills: ['Project Management', 'Leadership', 'Mentoring'],
        stakeholderLinks: {
          employers: ['alice.johnson@example.com'],
        },
        bio: 'Senior software engineer with 10+ years of experience, passionate about mentoring young developers.',
        location: 'New York, NY',
        phoneNumber: '098-765-4321',
      },
      {
        userId: 3, // Alice Johnson (Employer)
        profileImage: 'https://example.com/profiles/alice-johnson.jpg',
        skills: ['Recruitment', 'Team Building', 'Business Development'],
        stakeholderLinks: {},
        bio: 'Tech company founder looking to connect with talented youth and experienced mentors.',
        location: 'Seattle, WA',
        phoneNumber: '555-555-5555',
      },
      {
        userId: 4, // Bob Brown (Youth)
        profileImage: 'https://example.com/profiles/bob-brown.jpg',
        skills: ['Python', 'Data Science', 'Machine Learning'],
        stakeholderLinks: {
          mentors: ['jane.smith@example.com'],
          employers: ['alice.johnson@example.com'],
        },
        bio: 'Data science enthusiast looking to break into the tech industry.',
        location: 'Boston, MA',
        phoneNumber: '444-444-4444',
      },
    ];

    await connection.getRepository(Profile).clear(); // Clear existing profiles

    const profilesSeeded = await connection.manager.find(Profile);
    if (profilesSeeded.length === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Profile)
        .values(profiles)
        .execute();
    }
  }
}
