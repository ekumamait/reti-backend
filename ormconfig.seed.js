module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/dist/**/*.entity.js'],
  migrations: [__dirname + '/dist/db/migrations/*.js'],
  seeds: [__dirname + '/dist/db/seeds/*.js'],
  factories: [__dirname + '/dist/db/factories/*.js'],
};
