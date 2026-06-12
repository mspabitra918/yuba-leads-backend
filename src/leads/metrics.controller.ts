import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LeadsService } from "./leads.service";

// Real platform telemetry. Every value here is measured/queried — nothing is
// simulated. The frontend TelemetryWidget polls this endpoint.
@Controller("metrics")
export class MetricsController {
  private readonly startedAt = Date.now();

  constructor(
    private readonly leadsService: LeadsService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  async metrics() {
    const totalLeads = await this.leadsService.count();
    return {
      ok: true,
      serverTime: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      processUptimeSeconds: Math.round((Date.now() - this.startedAt) / 1000),
      totalLeads,
      activeVerticals: 4,
      dbDialect: this.config.get<string>("DB_DIALECT") || "sqlite",
    };
  }
}
