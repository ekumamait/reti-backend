import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/product-query.dto';
import { PaginatedResponse } from '../common/pagination.util';
import { Product } from '../database/entities/product.entity';
import { ApiResponse } from '../common/response.util';

@ApiTags('v1/products')
@Controller({ path: 'products', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ApiResponse<Product>> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query() query: ProductQueryDto,
  ): Promise<PaginatedResponse<Product>> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Product>> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<Product>> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<Product>> {
    return this.productsService.remove(id);
  }
}
