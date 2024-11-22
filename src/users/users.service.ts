import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/constants';
import { returnResponse, ApiResponse } from '../common/response.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ApiResponse<User[]>> {
    const users = await this.userRepository.find();
    if (!users) {
      throw new NotFoundException(ERROR_MESSAGES.USERS_NOT_FOUND());
    }
    return returnResponse(200, SUCCESS_MESSAGES.USERS_FOUND, users);
  }

  async findOneByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND(email));
    }
    return returnResponse(200, SUCCESS_MESSAGES.USER_EMAIL_FOUND(email), user);
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    return user;
  }

  async findByUserId(id: number): Promise<ApiResponse<UserDto>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(SUCCESS_MESSAGES.USER_FOUND(id));
    }
    return returnResponse(200, SUCCESS_MESSAGES.USER_CREATED, user);
  }

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        ERROR_MESSAGES.USER_ALREADY_EXISTS(createUserDto.email),
      );
    }

    const existingUserByName = await this.userRepository.findOne({
      where: {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      },
    });
    if (existingUserByName) {
      throw new ConflictException(
        `User with first name ${createUserDto.firstName} 
        and last name ${createUserDto.lastName} already exists`,
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);
    return returnResponse(201, SUCCESS_MESSAGES.USER_CREATED, savedUser);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UpdateUserDto>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if ('email' in updateUserDto) {
      throw new BadRequestException('Email address cannot be updated');
    }
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.findOne(id);
    return returnResponse(200, SUCCESS_MESSAGES.USER_UPDATED, updatedUser);
  }

  async delete(id: number): Promise<ApiResponse<UserDto>> {
    const removedUser = await this.findOne(id);
    await this.userRepository.delete(id);
    return returnResponse(204, SUCCESS_MESSAGES.USER_DELETED, removedUser);
  }
}
