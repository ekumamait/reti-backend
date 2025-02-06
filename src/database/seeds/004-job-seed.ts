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
        title: 'Software Engineer',
        description: 'Develop scalable applications with modern technologies.',
        location: 'New York, NY',
        salary: { min: 120000, max: 150000 },
        qualifications: ['JavaScript', 'React', 'Node.js'],
        status: 'active',
        interested: [],
        employer: employers[0],
        positions: 3,
        experience: '3+ years',
        jobCategory: 'Technology',
        jobType: 'fulltime',
        applicationDeadline: new Date('2025-12-31'),
        companyName: 'Tech Corp',
        contactEmail: 'hr@techcorp.com',
        imageUrl:
          'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Data Scientist',
        description: 'Analyze and interpret complex data for decision-making.',
        location: 'San Francisco, CA',
        salary: { min: 130000, max: 160000 },
        qualifications: ['Python', 'Machine Learning', 'SQL'],
        status: 'active',
        interested: [],
        employer: employers[1],
        positions: 2,
        experience: '2+ years',
        jobCategory: 'Data Science',
        jobType: 'fulltime',
        applicationDeadline: new Date('2025-11-30'),
        companyName: 'Health Analytics',
        contactEmail: 'jobs@healthanalytics.com',
        imageUrl:
          'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Marketing Manager',
        description: 'Develop and execute marketing campaigns.',
        location: 'Los Angeles, CA',
        salary: { min: 90000, max: 120000 },
        qualifications: ['Digital Marketing', 'SEO', 'Google Ads'],
        status: 'active',
        interested: [],
        employer: employers[2],
        positions: 1,
        experience: '5+ years',
        jobCategory: 'Marketing',
        jobType: 'fulltime',
        applicationDeadline: new Date('2025-10-15'),
        companyName: 'AdVentures',
        contactEmail: 'marketing@adventures.com',
        imageUrl:
          'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Product Manager',
        description: 'Lead product development and go-to-market strategy.',
        location: 'Seattle, WA',
        salary: { min: 110000, max: 140000 },
        qualifications: ['Agile', 'User Research', 'JIRA'],
        status: 'active',
        interested: [],
        employer: employers[3],
        positions: 2,
        experience: '4+ years',
        jobCategory: 'Product Management',
        jobType: 'fulltime',
        applicationDeadline: new Date('2025-09-25'),
        companyName: 'InnovateX',
        contactEmail: 'pm@innovatex.com',
        imageUrl:
          'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'UI/UX Designer',
        description: 'Design user-friendly interfaces and experiences.',
        location: 'Remote',
        salary: { min: 80000, max: 110000 },
        qualifications: ['Figma', 'Adobe XD', 'User Research'],
        status: 'active',
        interested: [],
        employer: employers[4],
        positions: 1,
        experience: '3+ years',
        jobCategory: 'Design',
        jobType: 'part-time',
        applicationDeadline: new Date('2025-08-20'),
        companyName: 'Creative Studios',
        contactEmail: 'design@creativestudios.com',
        imageUrl:
          'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'DevOps Engineer',
        description: 'Manage cloud infrastructure and CI/CD pipelines.',
        location: 'Austin, TX',
        salary: { min: 130000, max: 160000 },
        qualifications: ['AWS', 'Docker', 'Kubernetes'],
        status: 'active',
        interested: [],
        employer: employers[5],
        positions: 2,
        experience: '4+ years',
        jobCategory: 'Technology',
        jobType: 'fulltime',
        applicationDeadline: new Date('2025-07-15'),
        companyName: 'Cloud Solutions',
        contactEmail: 'jobs@cloudsolutions.com',
        imageUrl:
          'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Cybersecurity Analyst',
        description: 'Ensure security and compliance of company systems.',
        location: 'Washington, DC',
        salary: { min: 110000, max: 140000 },
        qualifications: ['Ethical Hacking', 'SIEM', 'Incident Response'],
        status: 'active',
        interested: [],
        employer: employers[6],
        positions: 1,
        experience: '3+ years',
        jobCategory: 'Cybersecurity',
        jobType: 'fulltime',
        applicationDeadline: new Date('2025-06-30'),
        companyName: 'SecureTech',
        contactEmail: 'security@securetech.com',
        imageUrl:
          'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'HR Manager',
        description: 'Oversee recruitment and employee well-being programs.',
        location: 'Chicago, IL',
        salary: { min: 90000, max: 110000 },
        qualifications: ['HR Policies', 'Recruiting', 'Employee Engagement'],
        status: 'active',
        interested: [],
        employer: employers[7],
        positions: 1,
        experience: '5+ years',
        jobCategory: 'Human Resources',
        jobType: 'fulltime',
        applicationDeadline: new Date('2025-05-20'),
        companyName: 'PeopleFirst',
        contactEmail: 'hr@peoplefirst.com',
        imageUrl:
          'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'AI Researcher',
        description: 'Develop cutting-edge AI models and solutions.',
        location: 'Boston, MA',
        salary: { min: 140000, max: 180000 },
        qualifications: ['Deep Learning', 'TensorFlow', 'NLP'],
        status: 'active',
        interested: [],
        employer: employers[8],
        positions: 2,
        experience: '3+ years',
        jobCategory: 'Artificial Intelligence',
        jobType: 'fulltime',
        applicationDeadline: new Date('2025-04-10'),
        companyName: 'AI Labs',
        contactEmail: 'research@ailabs.com',
        imageUrl:
          'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Content Writer',
        description: 'Write engaging content for various platforms.',
        location: 'Remote',
        salary: { min: 60000, max: 80000 },
        qualifications: ['SEO Writing', 'Copywriting', 'Social Media'],
        status: 'active',
        interested: [],
        employer: employers[9],
        positions: 1,
        experience: '2+ years',
        jobCategory: 'Writing',
        jobType: 'part-time',
        applicationDeadline: new Date('2025-03-15'),
        companyName: 'WriteWell',
        contactEmail: 'editor@writewell.com',
        imageUrl:
          'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?q=80&w=2498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
