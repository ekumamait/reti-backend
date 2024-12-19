import { IsOptional, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateInspirationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(100, { message: 'Title must be less than 100 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @MaxLength(500, { message: 'Description must be less than 500 characters' })
  description?: string;

  @IsOptional()
  likes: number;
}
