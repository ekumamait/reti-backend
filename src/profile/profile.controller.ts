import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<any> {
    return this.profileService.create(+userId, createProfileDto);
  }

  @Get()
  findAll(): Promise<any> {
    return this.profileService.findAll();
  }

  @Get('search')
  findBySkills(@Query('skills') skills: string[]): Promise<any> {
    return this.profileService.findBySkills(skills);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.profileService.findByUserId(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<any> {
    return this.profileService.delete(+id);
  }
}
