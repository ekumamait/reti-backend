import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/constants';
import { returnResponse, ApiResponse } from '../common/response.util';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ApiResponse<ProductDto>> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    return returnResponse(201, SUCCESS_MESSAGES.PRODUCT_CREATED, savedProduct);
  }

  async findAll(): Promise<ApiResponse<ProductDto[]>> {
    const products = await this.productRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    return returnResponse(200, SUCCESS_MESSAGES.PRODUCTS_FOUND, products);
  }

  async findOne(id: string): Promise<ApiResponse<ProductDto>> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
    });
    if (!product) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND(id));
    }
    return returnResponse(200, SUCCESS_MESSAGES.PRODUCT_FOUND(id), product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<ProductDto>> {
    const product = await this.findOne(id);
    Object.assign(product.data, updateProductDto);
    const updatedProduct = await this.productRepository.save(product.data);
    return returnResponse(
      200,
      SUCCESS_MESSAGES.PRODUCT_UPDATED,
      updatedProduct,
    );
  }

  async delete(id: string): Promise<ApiResponse<ProductDto>> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND(id));
    }

    product.isActive = false;
    const deletedProduct = await this.productRepository.remove(product);
    return returnResponse(
      200,
      SUCCESS_MESSAGES.PRODUCT_DELETED(id),
      deletedProduct,
    );
  }
}
