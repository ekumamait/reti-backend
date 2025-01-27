import { IsOptional, IsEnum } from 'class-validator';
import { PaginationParams } from '../../common/pagination.util';

export class NotificationQueryDto implements PaginationParams {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt'])
  sortBy?: string;
}
