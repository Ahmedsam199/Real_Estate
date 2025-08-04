import { Controller, Get, Req } from '@nestjs/common';
import { TenantService } from 'src/tenant/tenant.service';
import { Request } from 'express';
import { PrismaClient } from 'generated/prisma';

@Controller('property')
export class PropertyController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  async getAllProperties(@Req() req: Request) {
    const tenantId = req['tenantId'];
    const client = await this.tenantService.getClient(tenantId);
    return client.property.findMany();
  }
}
