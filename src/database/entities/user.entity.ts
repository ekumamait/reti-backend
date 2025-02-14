import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { Notification } from './notification.entity';
import { Product } from './product.entity';
import { Job } from './job.entity';
import { IsPhoneNumber } from 'class-validator';
import { MentorshipSession } from './mentorship-session.entity';
import { Inspiration } from './inspiration.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  @IsPhoneNumber(null)
  phoneNumber: string;

  @Column({ default: 'youth' })
  role: 'youth' | 'mentor' | 'employer' | 'admin' | 'super' | 'staff';

  @Column({ default: false })
  isOnboarded: boolean;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @Column()
  password: string;

  @OneToMany(() => Conversation, (conversation) => conversation.messages)
  conversations: Conversation[];

  @OneToMany(() => Job, (job) => job.employer)
  jobs: Job[];

  @OneToMany(() => Inspiration, (inspiration) => inspiration.mentor)
  inspirations: Inspiration[];

  @OneToMany(() => MentorshipSession, (session) => session.mentor)
  mentorSessions: MentorshipSession[];

  @OneToMany(() => MentorshipSession, (session) => session.youth)
  bookedSessions: MentorshipSession[];

  @CreateDateColumn()
  createdAt: Date;
}
