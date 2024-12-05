import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from 'src/common/response.util';
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
    return this.productsService.create(req.user, createProductDto);
  }

  @Get()
  findAll(): Promise<ApiResponse<ProductDto[]>> {
    return this.productsService.findAll();
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
    return this.productsService.update(req.user, id, updateProductDto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<ProductDto>> {
    return this.productsService.delete(req.user, id);
  }
}
