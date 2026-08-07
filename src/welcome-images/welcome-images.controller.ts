import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { WelcomeImagesService } from './welcome-images.service';
import { CreateWelcomeImageDto } from './dto/create-welcome-image.dto';
import { UpdateWelcomeImageDto } from './dto/update-welcome-image.dto';
import { WelcomeImage } from '../database/entities/welcome-image.entity';
import { ApiResponse } from '../common/response.util';
import { Roles } from '../authentication/decorators/roles.decorator';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { USER_ROLES } from '../common/constants';

@ApiTags('v1/welcome-images')
@Controller({ path: 'welcome-images', version: '1' })
export class WelcomeImagesController {
  constructor(private readonly welcomeImagesService: WelcomeImagesService) {}

  @Get()
  async findAll(): Promise<ApiResponse<WelcomeImage[]>> {
    return this.welcomeImagesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLES.SUPER)
  async create(
    @Body() createDto: CreateWelcomeImageDto,
  ): Promise<ApiResponse<WelcomeImage>> {
    return this.welcomeImagesService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLES.SUPER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateWelcomeImageDto,
  ): Promise<ApiResponse<WelcomeImage>> {
    return this.welcomeImagesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLES.SUPER)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<WelcomeImage>> {
    return this.welcomeImagesService.remove(id);
  }
}
