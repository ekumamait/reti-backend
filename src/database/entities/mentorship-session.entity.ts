import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('mentorship_sessions')
export class MentorshipSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  mentor: User;

  @ManyToOne(() => User)
  youth: User;

  @Column('timestamp')
  sessionDate: Date;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';

  @Column()
  duration: number;

  @Column({ nullable: true })
  mentorId: number;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
