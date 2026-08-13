import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { Notification } from './notification.entity';
import { Product } from './product.entity';
import { Job } from './job.entity';
import { Matches } from 'class-validator';
import {
  ERROR_MESSAGES,
  UGANDA_PHONE_NUMBER_REGEX,
} from '../../common/constants';
import { MentorshipSession } from './mentorship-session.entity';
import { Inspiration } from './inspiration.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  @Matches(UGANDA_PHONE_NUMBER_REGEX, {
    message: ERROR_MESSAGES.INVALID_PHONE_NUMBER,
  })
  phoneNumber: string;

  @Column({ default: 'youth' })
  role: 'youth' | 'mentor' | 'employer' | 'admin' | 'super' | 'staff';

  @Column({ default: false })
  isOnboarded: boolean;

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
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
