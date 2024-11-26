import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Message } from '../../messages/entities/message.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';

import { Notification } from './notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'youth' })
  role: 'youth' | 'mentor' | 'employer';

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @Column()
  password: string;

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @ManyToMany(() => Conversation, (conversation) => conversation.participants)
  conversations: Conversation[];

  @CreateDateColumn()
  createdAt: Date;
}
