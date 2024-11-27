import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;
}
