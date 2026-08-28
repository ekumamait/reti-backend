import { IsEnum, IsOptional } from 'class-validator';
import { PaginationParams } from '../../common/pagination.util';
import { SupportRequestStatus } from '../../database/entities/support-request.entity';

export class SupportQueryDto implements PaginationParams {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SupportRequestStatus)
  status?: SupportRequestStatus;
}
