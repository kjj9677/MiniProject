import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'miniproject',
  password: 'postgres',
  database: 'miniproject',
  entities: [__dirname + '/../entities/*.entity.{js,ts}'],
  synchronize: true,
};
