import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/user.entity';

dotenv.config();

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: [User],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  // entities: ["src/db/entities/**/*.ts"],
  // migrations: ["src/db/migrations/**/*.ts"],
};

const dataSource = new DataSource(config);
export default dataSource;

