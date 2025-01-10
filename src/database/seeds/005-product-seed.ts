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
          imageUrl: [
            'https://upload.wikimedia.org/wikipedia/commons/a/a2/Laptop_open.jpg',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
            'https://cdn.pixabay.com/photo/2016/11/29/12/54/technology-1869308_1280.jpg',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Smartphone',
          category: 'Electronics',
          description: 'Latest model smartphone with advanced features',
          price: 699.99,
          stockQuantity: 100,
          imageUrl: [
            'https://upload.wikimedia.org/wikipedia/commons/8/82/Samsung_Galaxy_S21.jpg',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
            'https://cdn.pixabay.com/photo/2017/01/22/19/04/iphone-2001771_1280.jpg',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Office Desk',
          category: 'Furniture',
          description: 'Modern office desk with spacious workspace',
          price: 299.99,
          stockQuantity: 25,
          imageUrl: [
            'https://upload.wikimedia.org/wikipedia/commons/6/6a/Office_desk.jpg',
            'https://images.unsplash.com/photo-1519241047957-be31d7379a5d',
            'https://cdn.pixabay.com/photo/2015/05/31/10/52/office-791586_1280.jpg',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Coffee Maker',
          category: 'Appliances',
          description: 'Professional grade coffee maker for home use',
          price: 149.99,
          stockQuantity: 75,
          imageUrl: [
            'https://upload.wikimedia.org/wikipedia/commons/8/87/Espresso_machine.jpg',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
            'https://cdn.pixabay.com/photo/2016/11/21/12/46/coffee-maker-1846384_1280.jpg',
          ],
          isActive: true,
          userId: 1,
        },
        {
          name: 'Wireless Headphones',
          category: 'Electronics',
          description: 'Premium wireless headphones with noise cancellation',
          price: 199.99,
          stockQuantity: 150,
          imageUrl: [
            'https://upload.wikimedia.org/wikipedia/commons/4/4c/Wireless_headphones.jpg',
            'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
            'https://cdn.pixabay.com/photo/2015/05/07/11/02/headphones-756063_1280.jpg',
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
