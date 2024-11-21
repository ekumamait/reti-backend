module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password123',
  database: process.env.DATABASE_NAME || 'reti_backend',
  synchronize: false,
  logging: true,
  entities: [__dirname + '/dist/**/*.entity.js'],
  migrations: [__dirname + '/dist/db/migrations/*.js'],
  seeds: [__dirname + '/dist/db/seeds/*.js'],
  factories: [__dirname + '/dist/db/factories/*.js'],
};
