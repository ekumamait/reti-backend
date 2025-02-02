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
    // Use a transaction for atomicity
    return this.inspirationsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Get inspiration with lock
        const inspiration = await transactionalEntityManager
          .createQueryBuilder(Inspiration, 'inspiration')
          .setLock('pessimistic_write')
          .leftJoinAndSelect('inspiration.mentor', 'mentor')
          .leftJoinAndSelect('inspiration.likedBy', 'likedBy')
          .where('inspiration.id = :id', { id })
          .getOne();

        if (!inspiration) {
          throw new NotFoundException(`Inspiration #${id} not found`);
        }

        const user = await this.usersService.findOne(userId);
        if (!user) {
          throw new NotFoundException(`User #${userId} not found`);
        }

        // Check if user has already liked
        const hasLiked = inspiration.likedBy.some(
          (likedUser) => likedUser.id === userId,
        );

        if (hasLiked) {
          // Unlike - Remove user and decrease count
          inspiration.likedBy = inspiration.likedBy.filter(
            (u) => u.id !== userId,
          );
          inspiration.likesCount = Math.max(0, inspiration.likesCount - 1);
        } else {
          // Like - Add user and increase count
          inspiration.likedBy.push(user);
          inspiration.likesCount = inspiration.likedBy.length; // Ensure count matches actual likes
        }

        // Save changes
        const updatedInspiration = await transactionalEntityManager.save(
          Inspiration,
          inspiration,
        );

        return returnResponse(
          200,
          hasLiked
            ? 'Inspiration unliked successfully'
            : 'Inspiration liked successfully',
          updatedInspiration,
        );
      },
    );
  }
}
