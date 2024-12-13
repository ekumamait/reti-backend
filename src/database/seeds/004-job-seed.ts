import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Job } from '../entities/job.entity';
import { User } from '../entities/user.entity';

export default class CreateJobs implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // Fetch the employer users
    const employers = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'employer' })
      .getMany();

    if (employers.length === 0) {
      throw new Error('No employers found');
    }

    const jobs: Partial<Job>[] = [
      {
        title: 'Software Developer',
        description: 'Develop and maintain web applications.',
        location: 'New York, NY',
        salary: { min: 120000, max: 150000 },
        qualifications: [
          'Proficiency in JavaScript',
          'Experience with React',
          'Knowledge of Node.js',
        ],
        status: 'active',
        interested: [],
        employer: employers[0],
        positions: 3,
        experience: '3+ years',
        jobCategory: 'Technology',
        jobType: 'fulltime',
        applicationDeadline: new Date('2023-12-31'),
        companyName: 'Tech Corp',
        contactEmail: 'hr@techcorp.com',
      },
      {
        title: 'Data Scientist',
        description: 'Analyze and interpret complex data.',
        location: 'San Francisco, CA',
        salary: { min: 130000, max: 160000 },
        qualifications: [
          'Proficiency in Python',
          'Experience with machine learning',
          'Knowledge of SQL',
        ],
        status: 'active',
        interested: [],
        employer: employers[1],
        positions: 2,
        experience: '2+ years',
        jobCategory: 'Healthcare',
        jobType: 'fulltime',
        applicationDeadline: new Date('2023-11-30'),
        companyName: 'Health Analytics',
        contactEmail: 'jobs@healthanalytics.com',
      },
    ];

    await connection
      .createQueryBuilder()
      .insert()
      .into(Job)
      .values(jobs)
      .execute();
  }
}
