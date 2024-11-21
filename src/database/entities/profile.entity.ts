import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  profileImage: string;

  @Column('text', { array: true, nullable: true, default: [] })
  skills: string[];

  @Column('jsonb', { nullable: true })
  stakeholderLinks: {
    mentors?: string[];
    employers?: string[];
  };

  @Column('text', { nullable: true })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
