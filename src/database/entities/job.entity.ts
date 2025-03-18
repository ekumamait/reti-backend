import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { JobApplication } from './job-applications.entity';

@Entity()
@Unique(['title', 'location', 'employer'])
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  location: string;

  @Column('json')
  salary: {
    min: number;
    max: number;
  };

  @Column('text', { array: true, nullable: true })
  qualifications: string[];

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  @Column('int', { array: true, nullable: true })
  interested: number[];

  @ManyToOne(() => User, (user) => user.jobs)
  @JoinColumn({ name: 'employer' })
  employer: User;

  @Column()
  positions: number;

  @Column()
  experience: string;

  @Column()
  jobCategory: string;

  @Column({
    type: 'enum',
    enum: ['fulltime', 'part-time', 'freelance'],
  })
  jobType: 'fulltime' | 'part-time' | 'freelance';

  @OneToMany(() => JobApplication, (application) => application.job)
  applications: JobApplication[];

  @Column()
  applicationDeadline: Date;

  @Column()
  companyName: string;

  @Column()
  contactEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
