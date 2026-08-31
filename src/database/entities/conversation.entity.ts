import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb', { nullable: true })
  messages: {
    senderId: number;
    receiverId: number;
    id: number;
    content: string;
    createdAt: Date;
    isRead: boolean;
  }[];

  @CreateDateColumn()
  createdAt: Date;
}
