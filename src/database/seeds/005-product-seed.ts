import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Product } from '../entities/product.entity';

export default class CreateProducts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const existingProducts = await connection.getRepository(Product).find();

    if (existingProducts.length === 0) {
      const products: Partial<Product>[] = [
        {
          name: 'Laptop Computer',
          category: 'Electronics',
          description: 'High-performance laptop with latest specifications.',
          price: 999.99,
          stockQuantity: 5,
          imageUrl: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Smartphone',
          category: 'Electronics',
          description: 'Latest model smartphone with advanced features.',
          price: 699.99,
          stockQuantity: 100,
          imageUrl: [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Office Desk',
          category: 'Furniture',
          description: 'Modern office desk with spacious workspace.',
          price: 299.99,
          stockQuantity: 25,
          imageUrl: [
            'https://images.unsplash.com/photo-1519241047957-be31d7379a5d',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Coffee Maker',
          category: 'Appliances',
          description: 'Professional grade coffee maker for home use.',
          price: 149.99,
          stockQuantity: 75,
          imageUrl: [
            'https://images.unsplash.com/photo-1608354580875-30bd4168b351?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Wireless Headphones',
          category: 'Electronics',
          description: 'Premium wireless headphones with noise cancellation.',
          price: 199.99,
          stockQuantity: 150,
          imageUrl: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Gaming Chair',
          category: 'Furniture',
          description: 'Ergonomic gaming chair with adjustable settings.',
          price: 249.99,
          stockQuantity: 40,
          imageUrl: [
            'https://images.unsplash.com/photo-1598550468793-d6306cd481c1?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: '4K Monitor',
          category: 'Electronics',
          description: 'Ultra HD 4K Monitor with high refresh rate.',
          price: 499.99,
          stockQuantity: 60,
          imageUrl: [
            'https://images.unsplash.com/photo-1711540846696-9389ab66377e?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Electric Kettle',
          category: 'Appliances',
          description: 'Stainless steel electric kettle with auto shut-off.',
          price: 59.99,
          stockQuantity: 90,
          imageUrl: [
            'https://images.unsplash.com/photo-1579752898926-3bcbc125ae2e?q=80&w=3512&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Bluetooth Speaker',
          category: 'Electronics',
          description: 'Portable Bluetooth speaker with deep bass.',
          price: 89.99,
          stockQuantity: 120,
          imageUrl: [
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=3731&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Mechanical Keyboard',
          category: 'Electronics',
          description: 'RGB mechanical keyboard with customizable switches.',
          price: 129.99,
          stockQuantity: 80,
          imageUrl: [
            'https://images.unsplash.com/photo-1626958390898-162d3577f293?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Smart TV 55"',
          category: 'Electronics',
          description: '55-inch 4K Smart TV with voice control.',
          price: 799.99,
          stockQuantity: 35,
          imageUrl: [
            'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?q=80&w=2120&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Smartwatch',
          category: 'Wearable',
          description: 'Feature-packed smartwatch with fitness tracking.',
          price: 249.99,
          stockQuantity: 60,
          imageUrl: [
            'https://images.unsplash.com/photo-1617625802912-cde586faf331?q=80&w=3732&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'DSLR Camera',
          category: 'Photography',
          description: 'Professional DSLR camera with high-resolution sensor.',
          price: 1299.99,
          stockQuantity: 25,
          imageUrl: [
            'https://images.unsplash.com/photo-1593449651424-adb56e5001aa?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Wireless Mouse',
          category: 'Accessories',
          description: 'Ergonomic wireless mouse with precision tracking.',
          price: 49.99,
          stockQuantity: 200,
          imageUrl: [
            'https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?q=80&w=3292&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Tablet',
          category: 'Electronics',
          description: 'Latest model tablet with high-resolution display.',
          price: 499.99,
          stockQuantity: 50,
          imageUrl: [
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
          ],
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
