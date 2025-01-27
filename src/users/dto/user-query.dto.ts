import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationParams } from '../../common/pagination.util';

export class UserQueryDto implements PaginationParams {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['admin', 'mentor', 'youth', 'employer'])
  role?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsEnum(['id', 'firstName', 'lastName', 'createdAt'])
  sortBy?: string;
}
