import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationParams } from '../../common/pagination.util';

export class ProductQueryDto implements PaginationParams {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsEnum(['name', 'price', 'stockQuantity', 'createdAt', 'updatedAt'])
  sortBy?: string;
}
