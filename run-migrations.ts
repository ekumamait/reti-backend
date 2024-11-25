import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/dist/**/*.entity.js'],
  migrations: [
    __dirname +
      '/src/database/migrations/1732526000000-create-notifications.ts',
  ],
});

AppDataSource.initialize()
  .then(async () => {
    console.log('Running notifications migration...');
    await AppDataSource.runMigrations();
    console.log('Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.log('Error during migration:', error);
    process.exit(1);
  });
