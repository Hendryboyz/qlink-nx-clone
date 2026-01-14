import { Module } from '@nestjs/common';
import { PostsService } from '$/modules/bo/posts/posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from './posts.repository';
import { StorageModule } from '$/modules/upload/storage.module';
import { UploadController } from '$/modules/bo/upload.controller';
import { VerificationModule } from '$/modules/bo/verification/verification.module';

@Module({
  imports: [VerificationModule, StorageModule],
  controllers: [PostsController, UploadController],
  providers: [PostsService, PostRepository],
  exports: [PostsService],
})
export class PostsManagementModule {}
