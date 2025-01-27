import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationParams } from '../../common/pagination.util';

export class MentorshipSessionQueryDto implements PaginationParams {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['CONFIRMED', 'PENDING', 'CANCELED'])
  status?: string;

  @IsOptional()
  @IsEnum(['sessionDate', 'createdAt', 'status', 'duration'])
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
