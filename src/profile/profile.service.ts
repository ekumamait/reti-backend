import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../database/entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../database/entities/user.entity';
import { ERROR_MESSAGES } from '../common/constants';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    userId: number,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_ID_NOT_FOUND(userId));
    }

    const profile = this.profileRepository.create({
      ...createProfileDto,
      user,
    });

    return this.profileRepository.save(profile);
  }

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.find({
      relations: ['user'],
    });
  }

  async findByUserId(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException(ERROR_MESSAGES.PROFILE_NOT_FOUND(userId));
    }

    return profile;
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findByUserId(id);

    Object.assign(profile, updateProfileDto);

    return this.profileRepository.save(profile);
  }

  async delete(id: number): Promise<void> {
    const profile = await this.findByUserId(id);
    await this.profileRepository.remove(profile);
  }

  async findBySkills(skills: string[]): Promise<Profile[]> {
    return this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.skills && :skills', { skills })
      .leftJoinAndSelect('profile.user', 'user')
      .getMany();
  }
}
