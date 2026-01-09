import { Module } from '@nestjs/common';
import {
  BannersManagementController,
  BannersRepository,
  BannersManagementService
} from '$/modules/bo/banners';
import { UploadController } from '$/modules/bo/upload.controller';
import { StorageModule } from '$/modules/upload/storage.module';
import { VerificationModule } from '$/modules/bo/verification/verification.module';

@Module({
  imports: [StorageModule, VerificationModule],
  controllers: [BannersManagementController, UploadController],
  providers: [BannersManagementService, BannersRepository],
  exports: [BannersManagementService],
})
export class BannersModule {}
