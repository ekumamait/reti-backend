import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationParams } from '../../common/pagination.util';

export class InspirationQueryDto implements PaginationParams {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'likesCount'])
  sortBy?: string;
}
