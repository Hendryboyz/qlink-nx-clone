import { Module } from '@nestjs/common';
import {
  BannersManagementController,
  BannersRepository,
  BannersManagementService
} from '$/modules/bo/banners';

@Module({
  controllers: [BannersManagementController],
  providers: [BannersManagementService, BannersRepository],
  exports: [BannersManagementService],
})
export class BannersModule {}
