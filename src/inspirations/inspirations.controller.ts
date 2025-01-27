import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Put,
} from '@nestjs/common';
import { InspirationsService } from './inspirations.service';
import { CreateInspirationDto } from './dto/create-inspiration.dto';
import { UpdateInspirationDto } from './dto/update-inspiration.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { InspirationQueryDto } from './dto/inspiration-query.dto';
import { PaginatedResponse } from '../common/pagination.util';
import { Inspiration } from '../database/entities/inspiration.entity';
import { RequestWithUser } from '../common/types/types';
import { ApiResponse } from '../common/response.util';

@ApiTags('v1/inspirations')
@Controller({ path: 'inspirations', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class InspirationsController {
  constructor(private readonly inspirationsService: InspirationsService) {}

  @Post()
  async create(
    @Body() createInspirationDto: CreateInspirationDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Inspiration>> {
    return this.inspirationsService.create(req.user.id, createInspirationDto);
  }

  @Get()
  async findAll(
    @Query() query: InspirationQueryDto,
  ): Promise<PaginatedResponse<Inspiration>> {
    return this.inspirationsService.findAll(query);
  }

  @Get('mentor')
  async findMentorInspirations(
    @Request() req: RequestWithUser,
    @Query() query: InspirationQueryDto,
  ): Promise<PaginatedResponse<Inspiration>> {
    return this.inspirationsService.findMentorInspirations(req.user.id, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse<Inspiration>> {
    return this.inspirationsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateInspirationDto: UpdateInspirationDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Inspiration>> {
    return this.inspirationsService.update(
      req.user.id,
      id,
      updateInspirationDto,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Inspiration>> {
    return this.inspirationsService.remove(req.user.id, id);
  }

  @Put(':id/like')
  async like(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Inspiration>> {
    return this.inspirationsService.like(id, req.user.id);
  }
}
