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
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/product-query.dto';
import { PaginatedResponse } from '../common/pagination.util';
import { ApiResponse } from '../common/response.util';
import { ProductDto } from './dto/product.dto';
import { RequestWithUser } from 'src/common/types/types';

@ApiTags('v1/products')
@Controller({ path: 'products', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<ProductDto>> {
    return this.productsService.create(createProductDto, req.user);
  }

  @Get()
  async findAll(
    @Query() query: ProductQueryDto,
  ): Promise<PaginatedResponse<ProductDto>> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<ProductDto>> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<ProductDto>> {
    return this.productsService.update(id, updateProductDto, req.user);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<ProductDto>> {
    return this.productsService.remove(id, req.user);
  }
}
