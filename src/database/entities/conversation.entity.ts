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
    sender: string;
    receiverId: number;
    receiver: string;
    id: number;
    content: string;
    timestamp: Date;
    read: boolean;
  }[];

  @CreateDateColumn()
  createdAt: Date;
}
