import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspiration } from '../database/entities/inspiration.entity';
import { UsersService } from '../users/users.service';
import { CreateInspirationDto } from './dto/create-inspiration.dto';
import { UpdateInspirationDto } from './dto/update-inspiration.dto';
import { ApiResponse, returnResponse } from '../common/response.util';
import { InspirationQueryDto } from './dto/inspiration-query.dto';
import {
  PaginatedResponse,
  getPaginationParams,
  createPaginatedResponse,
} from '../common/pagination.util';

@Injectable()
export class InspirationsService {
  constructor(
    @InjectRepository(Inspiration)
    private readonly inspirationsRepository: Repository<Inspiration>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    mentorId: number,
    createDto: CreateInspirationDto,
  ): Promise<ApiResponse<Inspiration>> {
    const mentor = await this.usersService.findOne(mentorId);
    if (!mentor) {
      throw new NotFoundException(`Mentor #${mentorId} not found`);
    }

    const inspiration = this.inspirationsRepository.create({
      ...createDto,
      mentor: { id: mentorId },
      likedBy: [],
      likesCount: 0,
    });
    const savedInspiration = await this.inspirationsRepository.save(
      inspiration,
    );
    return returnResponse(
      201,
      'Inspiration created successfully',
      savedInspiration,
    );
  }

  async findAll(
    query?: InspirationQueryDto,
  ): Promise<PaginatedResponse<Inspiration>> {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(
      query || {},
    );

    const [inspirations, total] =
      await this.inspirationsRepository.findAndCount({
        relations: ['mentor', 'likedBy'],
        skip,
        take: limit,
        order: { [sortBy]: sortOrder },
      });

    return createPaginatedResponse(
      200,
      'Inspirations fetched successfully',
      inspirations,
      total,
      page,
      limit,
    );
  }

  async findMentorInspirations(
    mentorId: number,
    query?: InspirationQueryDto,
  ): Promise<PaginatedResponse<Inspiration>> {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(
      query || {},
    );

    const [inspirations, total] =
      await this.inspirationsRepository.findAndCount({
        where: { mentor: { id: mentorId } },
        relations: ['mentor', 'likedBy'],
        skip,
        take: limit,
        order: { [sortBy]: sortOrder },
      });

    return createPaginatedResponse(
      200,
      'Mentor inspirations fetched successfully',
      inspirations,
      total,
      page,
      limit,
    );
  }

  async findOne(id: number): Promise<ApiResponse<Inspiration>> {
    const inspiration = await this.inspirationsRepository.findOne({
      where: { id },
      relations: ['mentor', 'likedBy'],
    });

    if (!inspiration) {
      throw new NotFoundException(`Inspiration #${id} not found`);
    }

    return returnResponse(200, 'Inspiration fetched successfully', inspiration);
  }

  async update(
    mentorId: number,
    id: number,
    updateDto: UpdateInspirationDto,
  ): Promise<ApiResponse<Inspiration>> {
    const inspiration = await this.inspirationsRepository.findOne({
      where: { id, mentor: { id: mentorId } },
      relations: ['mentor', 'likedBy'],
    });

    if (!inspiration) {
      throw new NotFoundException(`Inspiration #${id} not found`);
    }

    const updatedInspiration = await this.inspirationsRepository.save({
      ...inspiration,
      ...updateDto,
    });

    return returnResponse(
      200,
      'Inspiration updated successfully',
      updatedInspiration,
    );
  }

  async remove(
    mentorId: number,
    id: number,
  ): Promise<ApiResponse<Inspiration>> {
    const inspiration = await this.inspirationsRepository.findOne({
      where: { id, mentor: { id: mentorId } },
      relations: ['mentor', 'likedBy'],
    });

    if (!inspiration) {
      throw new NotFoundException(`Inspiration #${id} not found`);
    }

    await this.inspirationsRepository.remove(inspiration);
    return returnResponse(200, 'Inspiration deleted successfully', inspiration);
  }

  async like(id: number, userId: number): Promise<ApiResponse<Inspiration>> {
    const inspiration = await this.inspirationsRepository.findOne({
      where: { id },
      relations: ['mentor', 'likedBy'],
    });

    if (!inspiration) {
      throw new NotFoundException(`Inspiration #${id} not found`);
    }

    const userIndex = inspiration.likedBy.findIndex(
      (user) => user.id === userId,
    );

    if (userIndex !== -1) {
      // Unlike
      inspiration.likedBy = inspiration.likedBy.filter(
        (user) => user.id !== userId,
      );
      inspiration.likesCount--;
    } else {
      // Like
      inspiration.likedBy.push({ id: userId } as any);
      inspiration.likesCount++;
    }

    const updatedInspiration = await this.inspirationsRepository.save(
      inspiration,
    );
    return returnResponse(
      200,
      userIndex !== -1
        ? 'Inspiration unliked successfully'
        : 'Inspiration liked successfully',
      updatedInspiration,
    );
  }
}
