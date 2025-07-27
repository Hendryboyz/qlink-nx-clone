import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalesforceSyncService } from '$/modules/crm/sales-force.service';

@Module({
  imports:[ConfigModule],
  providers:[SalesforceSyncService],
  exports: [SalesforceSyncService],
})
export class CrmModule {}
