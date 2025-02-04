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
          description: 'High-performance laptop with latest specifications.',
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
          description: 'Latest model smartphone with advanced features.',
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
          description: 'Modern office desk with spacious workspace.',
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
          description: 'Professional grade coffee maker for home use.',
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
          description: 'Premium wireless headphones with noise cancellation.',
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
        {
          name: 'Gaming Chair',
          category: 'Furniture',
          description: 'Ergonomic gaming chair with adjustable settings.',
          price: 249.99,
          stockQuantity: 40,
          imageUrl: [
            'https://upload.wikimedia.org/wikipedia/commons/9/90/Gaming_chair.jpg',
            'https://images.unsplash.com/photo-1590650516494-18c6649b40b1',
            'https://cdn.pixabay.com/photo/2019/10/11/18/33/gaming-chair-4540641_1280.jpg',
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
            'https://upload.wikimedia.org/wikipedia/commons/7/7f/Monitor_4K.jpg',
            'https://images.unsplash.com/photo-1580894908361-967148237263',
            'https://cdn.pixabay.com/photo/2016/11/29/05/08/computer-1869255_1280.jpg',
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
            'https://upload.wikimedia.org/wikipedia/commons/2/2c/Electric_kettle.jpg',
            'https://images.unsplash.com/photo-1587839844771-4f8913b24486',
            'https://cdn.pixabay.com/photo/2020/01/20/12/38/kettle-4780592_1280.jpg',
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
            'https://upload.wikimedia.org/wikipedia/commons/3/36/Bluetooth_speaker.jpg',
            'https://images.unsplash.com/photo-1580894732444-8db4c5e7dce9',
            'https://cdn.pixabay.com/photo/2020/05/26/10/08/speaker-5220561_1280.jpg',
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
            'https://upload.wikimedia.org/wikipedia/commons/b/b6/Mechanical_keyboard.jpg',
            'https://images.unsplash.com/photo-1572307480813-ceb0e60b84e0',
            'https://cdn.pixabay.com/photo/2021/06/06/10/51/mechanical-keyboard-6313027_1280.jpg',
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
            'https://upload.wikimedia.org/wikipedia/commons/1/1f/Smart_TV.jpg',
            'https://images.unsplash.com/photo-1609002980059-8baba42d9d0f',
            'https://cdn.pixabay.com/photo/2020/05/11/09/50/smart-tv-5159278_1280.jpg',
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
