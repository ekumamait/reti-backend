import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../database/entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileDto } from './dto/profile.dto';
import { User } from '../database/entities/user.entity';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/constants';
import { returnResponse, ApiResponse } from '../common/response.util';

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
  ): Promise<ApiResponse<ProfileDto>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_ID_NOT_FOUND(userId));
    }
    const profile = this.profileRepository.create({
      ...createProfileDto,
      user,
    });
    const savedProfile = await this.profileRepository.save(profile);
    return returnResponse(201, SUCCESS_MESSAGES.PROFILE_CREATED, savedProfile);
  }

  async findAll(): Promise<ApiResponse<ProfileDto[]>> {
    const profiles = this.profileRepository.find({
      relations: ['user'],
    });
    return returnResponse(200, SUCCESS_MESSAGES.PROFILES_FOUND, await profiles);
  }

  async findOne(id: number): Promise<any> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    return profile;
  }

  async findByUserId(userId: number): Promise<ApiResponse<ProfileDto>> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(ERROR_MESSAGES.PROFILE_NOT_FOUND(userId));
    }
    const { password, ...userWithoutPassword } = profile.user;
    return returnResponse(200, SUCCESS_MESSAGES.PROFILE_FOUND(userId), {
      ...profile,
      user: userWithoutPassword,
    });
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ApiResponse<ProfileDto>> {
    const profile = await this.findOne(id);
    Object.assign(profile, updateProfileDto);
    const updatedProfile = await this.profileRepository.save(profile);
    return returnResponse(
      200,
      SUCCESS_MESSAGES.PROFILE_UPDATED,
      updatedProfile,
    );
  }

  async delete(id: number): Promise<ApiResponse<ProfileDto>> {
    const profile = await this.findOne(id);
    await this.profileRepository.remove(profile);
    return returnResponse(204, SUCCESS_MESSAGES.PROFILE_DELETED, profile);
  }

  async findBySkills(skills: string[]): Promise<ProfileDto[]> {
    return this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.skills && :skills', { skills })
      .leftJoinAndSelect('profile.user', 'user')
      .getMany();
  }
}
