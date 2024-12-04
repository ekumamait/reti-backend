import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async delete(id: string): Promise<void> {
    this.logger.log('==== DELETE PRODUCT REQUEST ====');
    this.logger.log(`Attempting to delete product with ID: ${id}`);

    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
    });

    this.logger.log(`Product found: ${!!product}`);

    if (!product) {
      this.logger.error(
        `❌ Product with ID ${id} not found or already inactive`,
      );
      throw new NotFoundException(
        `Product with ID ${id} not found or already inactive`,
      );
    }

    try {
      product.isActive = false;
      await this.productRepository.save(product);
      this.logger.log(
        `✅ Successfully soft deleted product: ${product.name} (${id})`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Error deleting product: ${error.message}`,
        error.stack,
      );
      throw error;
    }

    this.logger.log('==== END DELETE REQUEST ====');
  }
}
