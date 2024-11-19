import { config } from 'dotenv';
import UserSeed from './seeds/UserSeed';
import { User } from './entities/User';
import { AppDataSource } from '../data-source';

// Load environment variables
config();

async function seed(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database. Starting seed...');

    const userSeed = new UserSeed();
    await userSeed.run(AppDataSource.getRepository(User));

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}

// Execute seeding
seed().catch((error) => {
  console.error('Fatal error during seeding:', error);
  process.exit(1);
});
