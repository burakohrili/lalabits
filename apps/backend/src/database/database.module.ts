import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.getOrThrow<string>('DATABASE_URL');
        const isSsl = url.includes('ssl=true') || url.includes('sslmode=require') || url.includes('railway');
        const isProd = process.env.NODE_ENV === 'production';

        return {
          type: 'postgres',
          url,
          synchronize: false,
          autoLoadEntities: true,
          ssl: isSsl ? { rejectUnauthorized: false } : false,
          // In production, run pending migrations automatically on startup
          migrationsRun: isProd,
          migrations: isProd ? [join(__dirname, 'migrations', '*.js')] : [],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
