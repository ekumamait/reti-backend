import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Inspiration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { default: '' })
  content: string;

  @ManyToOne(() => User, (user) => user.inspirations)
  mentor: User;

  @ManyToMany(() => User)
  @JoinTable({ name: 'inspiration_likes' })
  likedBy: User[];

  @Column({ default: 0 })
  likesCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  imageUrl: string;
}
