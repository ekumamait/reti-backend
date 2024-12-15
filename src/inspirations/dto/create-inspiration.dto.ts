import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateInspirationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
