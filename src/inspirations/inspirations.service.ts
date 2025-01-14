import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspiration } from '../database/entities/inspiration.entity';
import { UsersService } from '../users/users.service';
import { CreateInspirationDto } from './dto/create-inspiration.dto';
import { InspirationDto } from './dto/inspiration.dto';
import { UpdateInspirationDto } from './dto/update-inspiration.dto';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/constants';
import { ApiResponse, returnResponse } from 'src/common/response.util';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class InspirationsService {
  constructor(
    @InjectRepository(Inspiration)
    private inspirationsRepository: Repository<Inspiration>,
    private usersService: UsersService,
  ) {}

  async createInspiration(
    mentorId: number,
    createDto: CreateInspirationDto,
  ): Promise<ApiResponse<InspirationDto>> {
    const mentor = await this.usersService.findOne(mentorId);

    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }

    const existingInspiration = await this.inspirationsRepository.findOne({
      where: {
        title: createDto.title,
        mentor: { id: mentor.id },
      },
    });

    if (existingInspiration) {
      throw new ConflictException(
        'An inspiration with the same title already exists for this mentor.',
      );
    }

    const inspiration = this.inspirationsRepository.create({
      ...createDto,
      mentor: mentor,
    });

    const savedInspiration = await this.inspirationsRepository.save(
      inspiration,
    );
    return returnResponse(
      201,
      SUCCESS_MESSAGES.INSPIRATION_CREATED,
      savedInspiration,
    );
  }

  async getAllInspirations(): Promise<ApiResponse<InspirationDto[]>> {
    const inspirations = await this.inspirationsRepository.find({
      relations: ['mentor'],
    });
    return returnResponse(
      200,
      SUCCESS_MESSAGES.INSPIRATIONS_FOUND,
      inspirations,
    );
  }

  async getMentorInspirations(
    mentorId: number,
  ): Promise<ApiResponse<InspirationDto[]>> {
    const inspirations = await this.inspirationsRepository.find({
      where: { mentor: { id: mentorId } },
      relations: ['mentor'],
    });
    return returnResponse(
      200,
      SUCCESS_MESSAGES.INSPIRATIONS_FOUND,
      inspirations,
    );
  }

  async getOneInspiration(id: number): Promise<ApiResponse<InspirationDto>> {
    const inspiration = await this.inspirationsRepository.findOne({
      where: { id: id },
      relations: ['mentor'],
    });
    if (!inspiration) {
      throw new NotFoundException(`Inspiration with ID ${id} not found`);
    }
    return returnResponse(
      200,
      SUCCESS_MESSAGES.INSPIRATIONS_FOUND,
      inspiration,
    );
  }

  async updateInspiration(
    mentor: UserDto,
    inspirationId: number,
    updateDto: UpdateInspirationDto,
  ): Promise<ApiResponse<InspirationDto>> {
    if (mentor.role !== 'mentor') {
      throw new ForbiddenException('Only mentor can update jobs');
    }

    const inspiration = await this.inspirationsRepository.findOne({
      where: { id: inspirationId, mentor: { id: mentor.id } },
      relations: ['mentor'],
    });

    if (!inspiration) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }
    Object.assign(inspiration, updateDto);
    const updatedInspiration = await this.inspirationsRepository.save(
      inspiration,
    );

    return returnResponse(
      200,
      SUCCESS_MESSAGES.INSPIRATION_UPDATED,
      updatedInspiration,
    );
  }

  async deleteInspiration(
    mentor: UserDto,
    inspirationId: number,
  ): Promise<ApiResponse<InspirationDto>> {
    if (mentor.role !== 'mentor') {
      throw new ForbiddenException('Only mentor can delete jobs');
    }
    const inspiration = await this.inspirationsRepository.findOne({
      where: {
        id: inspirationId,
        mentor: { id: mentor.id },
      },
    });

    if (!inspiration) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await this.inspirationsRepository.remove(inspiration);
    return returnResponse(
      200,
      SUCCESS_MESSAGES.INSPIRATION_DELETED(inspiration.id),
    );
  }

  async likeInspiration(
    inspirationId: number,
    userId: number,
    likeDto: UpdateInspirationDto,
  ) {
    const user = await this.usersService.findOne(userId);

    if (user.role !== 'youth') {
      throw new UnauthorizedException('Only youth can like inspirations');
    }

    const inspiration = await this.inspirationsRepository.findOne({
      where: { id: inspirationId },
    });

    if (!inspiration) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }
    Object.assign(inspiration, likeDto);
    const updatedInspiration = await this.inspirationsRepository.save(
      inspiration,
    );
    return returnResponse(
      200,
      SUCCESS_MESSAGES.INSPIRATION_UPDATED,
      updatedInspiration,
    );
  }
}
