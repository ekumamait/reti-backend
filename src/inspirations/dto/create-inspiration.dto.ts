import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/database/entities/user.entity';

export class CreateInspirationDto {
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  likes: number;
}
