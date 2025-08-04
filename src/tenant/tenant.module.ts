import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Module({
  providers: [TenantService],
  exports: [TenantService], // <-- THIS is required to use it outside
})
export class TenantModule {}
