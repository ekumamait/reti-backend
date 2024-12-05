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
        salary: 120000,
        qualifications: [
          'Proficiency in JavaScript',
          'Experience with React',
          'Knowledge of Node.js',
        ],
        status: 'active',
        employerId: employers[0].id,
      },
      {
        title: 'Data Scientist',
        description: 'Analyze and interpret complex data.',
        location: 'San Francisco, CA',
        salary: 130000,
        qualifications: [
          'Proficiency in Python',
          'Experience with machine learning',
          'Knowledge of SQL',
        ],
        status: 'active',
        employerId: employers[1].id,
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
