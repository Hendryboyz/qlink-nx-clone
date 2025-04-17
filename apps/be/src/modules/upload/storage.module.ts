import { Module } from '@nestjs/common';
import { S3storageService } from '$/modules/upload/s3storage.service';

@Module({
  imports: [],
  controllers: [],
  providers: [S3storageService],
  exports: [S3storageService],
})
export class StorageModule {}
