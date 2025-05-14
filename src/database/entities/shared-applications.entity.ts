import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('shared_applications')
export class SharedApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  recipientEmail: string;

  @CreateDateColumn()
  sentAt: Date;
}
