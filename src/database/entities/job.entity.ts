import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  salary: number;

  @Column('text', { array: true, nullable: true })
  qualifications: string[];

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  @Column('int', { array: true, nullable: true })
  interested: number[];

  @ManyToOne(() => User, (user) => user.jobs)
  @JoinColumn({ name: 'employerId' })
  employer: User;

  @Column()
  employerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
