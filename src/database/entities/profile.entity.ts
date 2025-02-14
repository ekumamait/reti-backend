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

  @Column({ default: false })
  isRetiCandidate: boolean;

  @Column({ nullable: true })
  retiPartner: string;

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

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  get age(): number {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  email: string;

  @Column('jsonb', { nullable: true })
  skillsAndTraining: {
    traineeCategory?: string;
    trainingDuration?: string;
    trainingLocation?: string;
  };

  @Column('jsonb', { nullable: true })
  artisanDetails: {
    categoryOfArtisan?: string;
    nameOfHost?: string;
    villageOfArtisan?: string;
    subcountyOfArtisan?: string;
    centerRefugeeSettlement?: string;
    hostContact?: string;
  };

  @Column('jsonb', { nullable: true })
  geoLocationDetails: {
    partnerResponsible?: string;
    region?: string;
    district?: string;
    settlement?: string;
    subCounty?: string;
    parishZoneCluster?: string;
    village?: string;
  };

  @Column('jsonb', { nullable: true })
  participantDetails: {
    nameOfParticipant?: string;
    groupNumber?: string;
    individualNumber?: string;
    nin?: string;
    sex?: string;
    age?: string;
    maritalStatus?: string;
    specialInterestCategory?: string;
    disabilityType?: string;
    numberOfDisabilities?: string;
    mainDisabilityDetails?: string;
    nationalityCategory?: string;
    uniqueIdNo?: string;
  };

  @Column('jsonb', { nullable: true })
  trainingCentreDetails: {
    nameOfTrainingCentre?: string;
    locationVillage?: string;
    locationSubCounty?: string;
    locationSettlement?: string;
    mainTelephoneContact?: string;
    alternativeTelephoneContact?: string;
  };

  @Column('jsonb', { nullable: true })
  trainingCohorts: {
    cohort?: string;
    tradeTakenDuringTraining?: string;
  };

  @Column('jsonb', { nullable: true })
  retiTrainingDetails: {
    startTime?: Date;
    completionStatus?: string;
    reasonForDroppingOut?: string;
    monthsSpent?: string;
    certificationStatus?: string;
  };

  @Column('jsonb', { nullable: true })
  internshipAndStartupDetails: {
    completionTime?: Date;
    internshipPlacement?: string;
    startupKitReceived?: string;
    startupGrantReceived?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 'light' })
  theme: 'light' | 'dark';
}
