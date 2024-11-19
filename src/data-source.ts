import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './db/entities/User';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Be careful with this in production
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});
