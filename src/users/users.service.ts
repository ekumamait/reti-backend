import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  USER_ROLES,
} from '../common/constants';
import { returnResponse, ApiResponse } from '../common/response.util';
import { UserQueryDto } from './dto/user-query.dto';
import {
  PaginatedResponse,
  getPaginationParams,
  createPaginatedResponse,
} from '../common/pagination.util';
import { Profile } from 'src/database/entities/profile.entity';

const STAFF_ROLES: string[] = [
  USER_ROLES.ADMIN,
  USER_ROLES.SUPER,
  USER_ROLES.STAFF,
];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  private assertCanModify(targetId: number, requester: User): void {
    if (requester.id !== targetId && !STAFF_ROLES.includes(requester.role)) {
      throw new ForbiddenException(ERROR_MESSAGES.UNAUTHORIZED);
    }
  }

  async findAll(query?: UserQueryDto): Promise<PaginatedResponse<User>> {
    const { page, limit, skip, search, sortBy, sortOrder } =
      getPaginationParams(query || {});

    const whereClause: any = {};
    if (search) {
      whereClause.phoneNumber = ILike(`%${search}%`);
    }
    if (query?.role) {
      whereClause.role = query.role;
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: whereClause,
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
      select: [
        'id',
        'firstName',
        'lastName',
        'phoneNumber',
        'role',
        'isOnboarded',
        'createdAt',
      ],
    });

    return createPaginatedResponse(
      200,
      'Users fetched successfully',
      users,
      total,
      page,
      limit,
    );
  }

  async findMentors(query?: UserQueryDto): Promise<PaginatedResponse<User>> {
    const { page, limit, skip, search, sortBy, sortOrder } =
      getPaginationParams(query || {});

    const whereClause: any = {
      role: 'mentor',
    };
    if (search) {
      whereClause.phoneNumber = ILike(`%${search}%`);
    }

    const [mentors, total] = await this.userRepository.findAndCount({
      where: whereClause,
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
      select: [
        'id',
        'firstName',
        'lastName',
        'phoneNumber',
        'role',
        'isOnboarded',
        'createdAt',
      ],
    });

    return createPaginatedResponse(
      200,
      'Mentors fetched successfully',
      mentors,
      total,
      page,
      limit,
    );
  }

  async findEmployers(query?: UserQueryDto): Promise<PaginatedResponse<User>> {
    const { page, limit, skip, search, sortBy, sortOrder } =
      getPaginationParams(query || {});

    const whereClause: any = {
      role: 'employer',
    };
    if (search) {
      whereClause.phoneNumber = ILike(`%${search}%`);
    }

    const [employers, total] = await this.userRepository.findAndCount({
      where: whereClause,
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
      select: [
        'id',
        'firstName',
        'lastName',
        'phoneNumber',
        'role',
        'isOnboarded',
        'createdAt',
      ],
    });

    return createPaginatedResponse(
      200,
      'Employers fetched successfully',
      employers,
      total,
      page,
      limit,
    );
  }

  async findByUserId(id: number): Promise<ApiResponse<UserDto>> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'firstName',
        'lastName',
        'phoneNumber',
        'role',
        'isOnboarded',
        'createdAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_ID_NOT_FOUND(id));
    }

    return returnResponse(
      200,
      SUCCESS_MESSAGES.USER_FOUND(user.phoneNumber),
      user,
    );
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_ID_NOT_FOUND(id));
    }

    return user;
  }

  async findOneByNumber(phoneNumber: string): Promise<ApiResponse<UserDto>> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
      select: [
        'id',
        'firstName',
        'lastName',
        'phoneNumber',
        'role',
        'isOnboarded',
        'password',
        'createdAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND(phoneNumber));
    }

    return returnResponse(
      200,
      SUCCESS_MESSAGES.USER_PHONE_FOUND(phoneNumber),
      user,
    );
  }

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<UserDto>> {
    const existingUser = await this.userRepository.findOne({
      where: { phoneNumber: createUserDto.phoneNumber },
    });

    if (existingUser) {
      throw new ConflictException(
        ERROR_MESSAGES.USER_ALREADY_EXISTS(createUserDto.phoneNumber),
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    return returnResponse(201, SUCCESS_MESSAGES.USER_CREATED, savedUser);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    requester: User,
  ): Promise<ApiResponse<UserDto>> {
    this.assertCanModify(id, requester);

    const user = await this.findOne(id);

    if (
      updateUserDto.phoneNumber &&
      updateUserDto.phoneNumber !== user.phoneNumber
    ) {
      const existingUser = await this.userRepository.findOne({
        where: { phoneNumber: updateUserDto.phoneNumber },
      });

      if (existingUser) {
        throw new ConflictException(
          ERROR_MESSAGES.USER_ALREADY_EXISTS(updateUserDto.phoneNumber),
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return returnResponse(200, SUCCESS_MESSAGES.USER_UPDATED, updatedUser);
  }

  async remove(id: number, requester: User): Promise<ApiResponse<UserDto>> {
    if (requester.role !== USER_ROLES.SUPER) {
      throw new ForbiddenException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    return await this.userRepository.manager.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id },
        relations: ['notifications', 'profile'],
      });

      if (!user) {
        throw new NotFoundException(ERROR_MESSAGES.USER_ID_NOT_FOUND(id));
      }

      // Delete related records first
      if (user.notifications?.length) {
        await manager.remove(user.notifications);
      }

      if (user.profile) {
        await manager.remove(user.profile);
      }

      // Finally delete the user
      await manager.remove(user);

      return returnResponse(200, SUCCESS_MESSAGES.USER_DELETED, user);
    });
  }
}
