import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUrl,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stockQuantity: number;

  @IsArray()
  @IsString({ each: true })
  imageUrl?: string[];

  @IsNumber()
  userId?: number;

  @IsBoolean()
  isActive: boolean;
}
