import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { CreateLeadDto } from "./dto/create-lead.dto";

@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post("intake")
  @HttpCode(201)
  async intake(@Body() dto: CreateLeadDto) {
    const lead = await this.leadsService.create(dto);
    return {
      ok: true,
      id: lead.id,
      message: "Intake received.",
    };
  }

  @Get()
  @HttpCode(200)
  async list() {
    return this.leadsService.findAll();
  }
}
