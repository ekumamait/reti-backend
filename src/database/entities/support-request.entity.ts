import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum SupportRequestCategory {
  TECHNICAL_ISSUE = 'technical_issue',
  ACCOUNT_RECOVERY = 'account_recovery',
  GUIDANCE = 'guidance',
  GENERAL = 'general',
}

export enum SupportRequestStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
}

@Entity()
export class SupportRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @Column({ nullable: true })
  userId: number | null;

  @Column({ nullable: true })
  contact: string;

  @Column({
    type: 'enum',
    enum: SupportRequestCategory,
    default: SupportRequestCategory.GENERAL,
  })
  category: SupportRequestCategory;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: SupportRequestStatus,
    default: SupportRequestStatus.OPEN,
  })
  status: SupportRequestStatus;

  @Column({ type: 'text', nullable: true })
  adminResponse: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'respondedById' })
  respondedBy: User | null;

  @Column({ nullable: true })
  respondedById: number | null;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
