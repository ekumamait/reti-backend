import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  firstName: string;

  @Column({ unique: true })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
