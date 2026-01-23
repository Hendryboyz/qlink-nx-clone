import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalesforceSyncService } from '$/modules/crm/sales-force.service';
import { PendingEntityRepository } from '$/modules/crm/pending-entity.repository';
import { FallbackService } from '$/modules/crm/fallback.service';
import { CrmService } from '$/modules/crm/crm.service';

@Module({
  imports:[ConfigModule],
  providers:[SalesforceSyncService, FallbackService, PendingEntityRepository, CrmService],
  exports: [CrmService],
})
export class CrmModule {}
