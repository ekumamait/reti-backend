import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiResponse } from '../common/response.util';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProfileDto } from './dto/profile.dto';

@ApiTags('v1/profiles')
@Controller({ path: 'profiles', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ApiResponse<ProfileDto>> {
    return this.profileService.create(+userId, createProfileDto);
  }

  @Get()
  findAll(): Promise<ApiResponse<ProfileDto[]>> {
    return this.profileService.findAll();
  }

  @Get('search')
  findBySkills(@Query('skills') skills: string[]): Promise<any> {
    return this.profileService.findBySkills(skills);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ProfileDto>> {
    return this.profileService.findByUserId(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ApiResponse<any>> {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<ApiResponse<ProfileDto>> {
    return this.profileService.delete(+id);
  }
}
