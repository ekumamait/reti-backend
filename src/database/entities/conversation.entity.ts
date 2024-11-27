import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToMany(() => User)
  // @JoinTable()
  // participants: User[];

  @ManyToOne(() => User, (user) => user.conversationsAsUser1)
  @JoinColumn({ name: 'user1id' })
  user1: User;

  @ManyToOne(() => User, (user) => user.conversationsAsUser2)
  @JoinColumn({ name: 'user2id' })
  user2: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
