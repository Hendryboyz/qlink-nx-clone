import { Module } from '@nestjs/common';
import {
  BannersManagementController,
  BannersRepository,
  BannersManagementService
} from '$/modules/bo/banners';
import { UploadController } from '$/modules/bo/upload.controller';
import { StorageModule } from '$/modules/upload/storage.module';
import { VerificationModule } from '$/modules/bo/verification/verification.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [StorageModule, VerificationModule, ConfigModule],
  controllers: [BannersManagementController, UploadController],
  providers: [BannersManagementService, BannersRepository],
  exports: [BannersManagementService],
})
export class BannersModule {}
