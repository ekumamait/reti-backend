import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '../common/response.util';
import { ApiTags } from '@nestjs/swagger';
import { UserQueryDto } from './dto/user-query.dto';
import { PaginatedResponse } from '../common/pagination.util';
import { User } from '../database/entities/user.entity';

@ApiTags('v1/users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Query(ValidationPipe) query: UserQueryDto,
  ): Promise<PaginatedResponse<User>> {
    return this.usersService.findAll(query);
  }

  @Get('mentors')
  @UseGuards(AuthGuard('jwt'))
  async findMentors(
    @Query(ValidationPipe) query: UserQueryDto,
  ): Promise<PaginatedResponse<User>> {
    return this.usersService.findMentors(query);
  }

  @Get('employers')
  @UseGuards(AuthGuard('jwt'))
  async findEmployers(
    @Query(ValidationPipe) query: UserQueryDto,
  ): Promise<PaginatedResponse<User>> {
    return this.usersService.findEmployers(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<UserDto>> {
    return this.usersService.findByUserId(id);
  }

  @Post()
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserDto>> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserDto>> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<UserDto>> {
    return this.usersService.remove(id);
  }
}
