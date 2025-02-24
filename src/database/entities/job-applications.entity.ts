import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('job_applications')
@Unique(['userId'])
export class JobApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  jobId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applied_at: Date;
}
