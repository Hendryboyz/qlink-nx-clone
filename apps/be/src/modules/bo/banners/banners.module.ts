import { Module } from '@nestjs/common';
import {
  BannersManagementController,
  BannersRepository,
  BannersManagementService
} from '$/modules/bo/banners';
import { UploadController } from '$/modules/bo/upload.controller';
import { StorageModule } from '$/modules/upload/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [BannersManagementController, UploadController],
  providers: [BannersManagementService, BannersRepository],
  exports: [BannersManagementService],
})
export class BannersModule {}
