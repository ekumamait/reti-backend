import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Profile } from '../entities/profile.entity';

export default class CreateProfiles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const existingProfiles = await connection.getRepository(Profile).find();

    // Only seed if no profiles exist
    if (existingProfiles.length === 0) {
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
          email: 'john.doe@example.com',
          dateOfBirth: new Date('1995-05-15'),
          gender: 'male',
          theme: 'light',
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
          email: 'jane.smith@example.com',
          dateOfBirth: new Date('1985-08-20'),
          gender: 'female',
          theme: 'light',
        },
        {
          userId: 3, // Alice Johnson (Employer)
          profileImage: 'https://example.com/profiles/alice-johnson.jpg',
          skills: ['Recruitment', 'Team Building', 'Business Development'],
          stakeholderLinks: {},
          bio: 'Tech company founder looking to connect with talented youth and experienced mentors.',
          location: 'Seattle, WA',
          email: 'alice.johnson@example.com',
          dateOfBirth: new Date('1990-12-01'),
          gender: 'female',
          theme: 'light',
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
          email: 'bob.brown@example.com',
          dateOfBirth: new Date('1998-03-10'),
          gender: 'male',
          theme: 'light',
        },
      ];

      await connection
        .createQueryBuilder()
        .insert()
        .into(Profile)
        .values(profiles)
        .execute();
    }
  }
}
