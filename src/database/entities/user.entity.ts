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
  role: 'youth' | 'mentor' | 'employer';

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

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  profileImage: string;
}
