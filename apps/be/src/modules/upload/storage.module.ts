import { Module } from '@nestjs/common';
import { UploadController } from '$/modules/upload/upload.controller';
import { S3storageService } from '$/modules/upload/s3storage.service';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [S3storageService],
  exports: [S3storageService],
})
export class StorageModule {}
