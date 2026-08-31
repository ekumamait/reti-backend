import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ApiResponse, returnResponse } from '../common/response.util';
import {
  PaginatedResponse,
  getPaginationParams,
  createPaginatedResponse,
} from '../common/pagination.util';
import { ProductDto } from './dto/product.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { USER_ROLES } from 'src/common/constants';

const STAFF_ROLES: string[] = [
  USER_ROLES.ADMIN,
  USER_ROLES.SUPER,
  USER_ROLES.STAFF,
];

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    creator: UserDto,
  ): Promise<ApiResponse<ProductDto>> {
    const existingProduct = await this.productsRepository.findOne({
      where: {
        name: createProductDto.name,
        description: createProductDto.description,
        user: { id: creator.id },
      },
    });

    if (existingProduct) {
      throw new ConflictException(
        'A product with the same name and description already exists for this user.',
      );
    }
    const product = this.productsRepository.create({
      ...createProductDto,
      userId: creator.id,
    });
    const savedProduct = await this.productsRepository.save(product);
    return returnResponse(201, 'Product created successfully', savedProduct);
  }

  async findAll(
    query?: ProductQueryDto,
  ): Promise<PaginatedResponse<ProductDto>> {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(
      query || {},
    );

    const [products, total] = await this.productsRepository.findAndCount({
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
    });

    return createPaginatedResponse(
      200,
      'Products fetched successfully',
      products,
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<ApiResponse<ProductDto>> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return returnResponse(200, 'Product fetched successfully', product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    requester: UserDto,
  ): Promise<ApiResponse<ProductDto>> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    if (
      product.userId !== requester.id &&
      !STAFF_ROLES.includes(requester.role)
    ) {
      throw new ForbiddenException(
        'You are not authorized to modify this product',
      );
    }

    const updatedProduct = await this.productsRepository.save({
      ...product,
      ...updateProductDto,
    });

    return returnResponse(200, 'Product updated successfully', updatedProduct);
  }

  async remove(
    id: string,
    requester: UserDto,
  ): Promise<ApiResponse<ProductDto>> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    if (
      product.userId !== requester.id &&
      !STAFF_ROLES.includes(requester.role)
    ) {
      throw new ForbiddenException(
        'You are not authorized to delete this product',
      );
    }

    await this.productsRepository.remove(product);
    return returnResponse(200, 'Product deleted successfully', product);
  }
}
