import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Job } from './job.entity';

@Entity('job_applications')
@Unique(['userId', 'jobId'])
export class JobApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column()
  jobId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applied_at: Date;
}
