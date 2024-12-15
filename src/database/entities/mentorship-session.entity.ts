import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('mentorship_sessions')
export class MentorshipSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.mentorSessions)
  @JoinColumn({ name: 'mentor_id' })
  mentor: User;

  @Column({ type: 'uuid' })
  mentorId: string;

  @ManyToOne(() => User, (user) => user.bookedSessions)
  @JoinColumn({ name: 'youth_id' })
  youth: User;

  @Column({ type: 'uuid' })
  youthId: string;

  @Column({ type: 'timestamp' })
  sessionDate: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
