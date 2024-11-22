import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../db/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(role?: 'youth' | 'mentor' | 'employer'): Promise<User[]> {
    if (role) {
      const rolesArray = await this.userRepository.find({ where: { role } });
      if (rolesArray.length === 0)
        throw new NotFoundException(`Users with role ${role} not found`);
      return rolesArray;
    }
    return this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new ConflictException(
        `User with email ${createUserDto.email}, already exists`,
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
    return this.userRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
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
    return this.findOne(id);
  }

  async delete(id: number): Promise<UserDto> {
    const removedUser = await this.findOne(id);
    await this.userRepository.delete(id);
    return removedUser;
  }
}
