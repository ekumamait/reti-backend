import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import UserSeed from './seeds/UserSeed';
import { User } from './entities/User';

// Load environment variables
config();

async function seed(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User], // Add all your entities here
    synchronize: false, // Set to false for production
  });

  try {
    await dataSource.initialize();
    console.log('Connected to database. Starting seed...');

    const userSeed = new UserSeed();
    await userSeed.run(dataSource.getRepository(User));

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}

// Execute seeding
seed().catch((error) => {
  console.error('Fatal error during seeding:', error);
  process.exit(1);
});
