// Sequelize loads the Postgres driver via a dynamic `require('pg')` that
// Vercel's dependency tracer can't follow, so it gets dropped from the
// serverless bundle ("Please install pg package manually"). Importing the
// drivers here — in the module every entry (api/index.ts and main.ts) loads —
// forces them and their dependency tree into the traced bundle.
import 'pg';
import 'pg-hstore';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { Lead } from './leads/models/lead.model';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const base = {
          models: [Lead],
          autoLoadModels: true,
          // Migrations (sequelize-cli) are authoritative. Set DB_SYNC=true
          // only for throwaway local dev without running migrations.
          synchronize: config.get('DB_SYNC') === 'true',
          logging: false,
        };

        // Prefer a full connection string when provided (e.g. Postgres on a host).
        const url = config.get<string>('DATABASE_URL');
        if (url) {
          let needsSsl = true;
          try {
            const host = new URL(url).hostname;
            needsSsl = host !== 'localhost' && host !== '127.0.0.1';
          } catch {
            needsSsl = true;
          }
          return {
            ...base,
            uri: url,
            dialect: 'postgres' as Dialect,
            ...(needsSsl
              ? {
                  dialectOptions: {
                    ssl: { require: true, rejectUnauthorized: false },
                  },
                }
              : {}),
          };
        }

        const dialect = (config.get<string>('DB_DIALECT') ||
          'sqlite') as Dialect;

        if (dialect === 'sqlite') {
          return {
            ...base,
            dialect,
            storage: config.get<string>('DB_STORAGE') || './yuba-leads.sqlite',
          };
        }

        return {
          ...base,
          dialect,
          host: config.get<string>('DB_HOST') || '127.0.0.1',
          port: Number(config.get('DB_PORT')) || 5432,
          database: config.get<string>('DB_NAME') || 'yuba_leads',
          username: config.get<string>('DB_USER') || 'postgres',
          password: config.get<string>('DB_PASSWORD') || 'postgres',
        };
      },
    }),
    LeadsModule,
  ],
})
export class AppModule {}
