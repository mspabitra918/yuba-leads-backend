import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Lead } from './models/lead.model';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead)
    private readonly leadModel: typeof Lead,
  ) {}

  async create(dto: CreateLeadDto): Promise<Lead> {
    return this.leadModel.create({
      ...dto,
      status: 'new',
    } as any);
  }

  async findAll(): Promise<Lead[]> {
    return this.leadModel.findAll({ order: [['createdAt', 'DESC']] });
  }

  async count(): Promise<number> {
    return this.leadModel.count();
  }
}
