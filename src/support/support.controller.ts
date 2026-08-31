import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupportService } from './support.service';
import { SendSupportRequestDto } from './dto/send-support-request.dto';
import { RespondSupportRequestDto } from './dto/respond-support-request.dto';
import { SupportQueryDto } from './dto/support-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/response.util';
import { PaginatedResponse } from 'src/common/pagination.util';
import { RequestWithUser } from 'src/common/types/types';
import { OptionalJwtAuthGuard } from 'src/authentication/guards/optional-jwt.guard';
import { Roles } from 'src/authentication/decorators/roles.decorator';
import { RolesGuard } from 'src/authentication/guards/roles.guard';
import { USER_ROLES } from 'src/common/constants';
import { SupportRequest } from 'src/database/entities/support-request.entity';

@ApiTags('v1/support')
@Controller({ path: 'support', version: '1' })
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async sendSupportRequest(
    @Body(ValidationPipe) request: SendSupportRequestDto,
    @Request() req?: RequestWithUser,
  ): Promise<ApiResponse<SupportRequest>> {
    return this.supportService.createSupportRequest(request, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('mine')
  async findMine(
    @Request() req: RequestWithUser,
    @Query(ValidationPipe) query: SupportQueryDto,
  ): Promise<PaginatedResponse<SupportRequest>> {
    return this.supportService.findMine(req.user.id, query);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.SUPER, USER_ROLES.STAFF)
  @ApiBearerAuth()
  @Get()
  async findAll(
    @Query(ValidationPipe) query: SupportQueryDto,
  ): Promise<PaginatedResponse<SupportRequest>> {
    return this.supportService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<SupportRequest>> {
    return this.supportService.findOne(id, req.user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.SUPER, USER_ROLES.STAFF)
  @ApiBearerAuth()
  @Patch(':id/respond')
  async respond(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: RespondSupportRequestDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<SupportRequest>> {
    return this.supportService.respond(id, dto, req.user);
  }
}
