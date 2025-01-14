import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  Request,
  Patch,
} from '@nestjs/common';
import { InspirationsService } from './inspirations.service';
import { CreateInspirationDto } from './dto/create-inspiration.dto';
import { UpdateInspirationDto } from './dto/update-inspiration.dto';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { InspirationDto } from './dto/inspiration.dto';
import { ApiResponse } from 'src/common/response.util';
import { RequestWithUser } from 'src/common/types/types';

@ApiTags('v1/inspirations')
@Controller({ path: 'inspirations', version: '1' })
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InspirationsController {
  constructor(private readonly inspirationsService: InspirationsService) {}

  @Post()
  @Roles('mentor')
  async createInspiration(
    @Body() createDto: CreateInspirationDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<InspirationDto>> {
    return this.inspirationsService.createInspiration(req.user.id, createDto);
  }

  @Get()
  async getAllInspirations(): Promise<ApiResponse<InspirationDto[]>> {
    return this.inspirationsService.getAllInspirations();
  }

  @Get(':id')
  async getOneInspiration(
    @Param('id') id: number,
  ): Promise<ApiResponse<InspirationDto>> {
    return this.inspirationsService.getOneInspiration(id);
  }

  @Get('mentor')
  async getMentorInspirations(
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<InspirationDto[]>> {
    return this.inspirationsService.getMentorInspirations(req.user.id);
  }

  @Patch(':id')
  async updateInspiration(
    @Param('id') id: number,
    @Body() updateInspirationDto: UpdateInspirationDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<InspirationDto>> {
    return this.inspirationsService.updateInspiration(
      req.user,
      id,
      updateInspirationDto,
    );
  }

  @Delete(':id')
  async deleteInspiration(
    @Param('id') inspirationId: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<InspirationDto>> {
    return this.inspirationsService.deleteInspiration(req.user, inspirationId);
  }

  //upcoming refactor
  @Put(':id/like')
  @Roles('youth')
  like(@Request() req, @Param('id') id: number, likeDto: any) {
    return this.inspirationsService.likeInspiration(id, req.user.id, likeDto);
  }
}
