const { DataSource } = require('typeorm');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    path.join(__dirname, 'src/database/entities/*.{ts,js}'),
    path.join(__dirname, 'src/**/*.entity.{ts,js}'),
  ],
  migrations: [path.join(__dirname, 'src/database/migrations/*.{ts,js}')],
  migrationsTableName: 'typeorm_migrations',
});
