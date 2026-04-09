/**
 * TypeORM CLI datasource.
 * Used only by migration:generate / migration:run / migration:revert scripts.
 * Not imported by the NestJS application — AppModule uses DatabaseModule instead.
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  entities: [path.resolve(__dirname, '../**/*.entity.ts')],
  migrations: [path.resolve(__dirname, './migrations/*.ts')],
});
