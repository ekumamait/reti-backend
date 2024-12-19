import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { User } from 'src/database/entities/user.entity';

export class CreateInspirationDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Title cannot be longer than 100 characters' })
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsOptional()
  likes: number;
}
