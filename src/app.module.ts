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
        const dialect = (config.get<string>('DB_DIALECT') ||
          'sqlite') as Dialect;

        const base = {
          dialect,
          models: [Lead],
          autoLoadModels: true,
          // Migrations (sequelize-cli) are authoritative. Set DB_SYNC=true
          // only for throwaway local dev without running migrations.
          synchronize: config.get('DB_SYNC') === 'true',
          logging: false,
        };

        if (dialect === 'sqlite') {
          return {
            ...base,
            storage: config.get<string>('DB_STORAGE') || './yuba-leads.sqlite',
          };
        }

        return {
          ...base,
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
