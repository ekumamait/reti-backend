module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/dist/**/*.entity.js'],
  migrations: [__dirname + '/dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  seeds: [__dirname + '/dist/database/seeds/*.js'],
  factories: [__dirname + '/dist/database/factories/*.js'],
};
