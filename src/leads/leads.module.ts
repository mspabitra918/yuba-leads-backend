import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lead } from './models/lead.model';
import { LeadsController } from './leads.controller';
import { MetricsController } from './metrics.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [SequelizeModule.forFeature([Lead])],
  controllers: [LeadsController, MetricsController],
  providers: [LeadsService],
})
export class LeadsModule {}
