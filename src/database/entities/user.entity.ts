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

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @Column()
  password: string;

  @OneToMany(() => Conversation, (conversation) => conversation.messages)
  conversations: Conversation[];

  @CreateDateColumn()
  createdAt: Date;
}
