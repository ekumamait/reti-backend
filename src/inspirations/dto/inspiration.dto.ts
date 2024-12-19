import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsDate,
  IsObject,
  IsNumber,
} from 'class-validator';
import { User } from 'src/database/entities/user.entity';

export class InspirationDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;
  content: string;

  @IsOptional()
  likes: number;

  @IsObject()
  mentor: User;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
