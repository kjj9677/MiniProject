import { ConnectionOptions } from 'typeorm';

export const typeORMConfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'miniproject',
  password: 'postgres',
  database: 'miniproject',
  entities: [__dirname + '/../entities/*.entity.{js,ts}'],
  synchronize: false,
  migrations: ['dist/migations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/../migrations',
  },
};
