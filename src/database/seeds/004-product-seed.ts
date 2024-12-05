import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Product } from '../entities/product.entity';

export default class CreateProducts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const existingProducts = await connection.getRepository(Product).find();

    // Only seed if no products exist
    if (existingProducts.length === 0) {
      const products: Partial<Product>[] = [
        {
          name: 'Laptop Computer',
          category: 'Electronics',
          description: 'High-performance laptop with latest specifications',
          price: 999.99,
          stockQuantity: 50,
          imageUrl: 'https://example.com/laptop.jpg',
          isActive: true,
          userId: 1,
        },
        {
          name: 'Smartphone',
          category: 'Electronics',
          description: 'Latest model smartphone with advanced features',
          price: 699.99,
          stockQuantity: 100,
          imageUrl: 'https://example.com/smartphone.jpg',
          isActive: true,
          userId: 1,
        },
        {
          name: 'Office Desk',
          category: 'Furniture',
          description: 'Modern office desk with spacious workspace',
          price: 299.99,
          stockQuantity: 25,
          imageUrl: 'https://example.com/desk.jpg',
          isActive: true,
          userId: 1,
        },
        {
          name: 'Coffee Maker',
          category: 'Appliances',
          description: 'Professional grade coffee maker for home use',
          price: 149.99,
          stockQuantity: 75,
          imageUrl: 'https://example.com/coffeemaker.jpg',
          isActive: true,
          userId: 1,
        },
        {
          name: 'Wireless Headphones',
          category: 'Electronics',
          description: 'Premium wireless headphones with noise cancellation',
          price: 199.99,
          stockQuantity: 150,
          imageUrl: 'https://example.com/headphones.jpg',
          isActive: true,
          userId: 1,
        },
      ];

      await connection
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(products)
        .execute();
    }
  }
}
