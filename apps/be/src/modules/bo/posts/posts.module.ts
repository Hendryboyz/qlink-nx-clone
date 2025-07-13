import { Module } from '@nestjs/common';
import { PostsService } from '$/modules/posts/posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from '../../posts/posts.repository';
import { JwtAuthGuard } from '$/modules/bo/verification/jwt-auth.guard';
import { RolesGuard } from '../verification/roles.guard';
import { StorageModule } from '$/modules/upload/storage.module';
import { UploadController } from '$/modules/bo/posts/upload.controller';
import { VerificationModule } from '$/modules/bo/verification/verification.module';

@Module({
  imports: [VerificationModule, StorageModule],
  controllers: [PostsController, UploadController],
  providers: [PostsService, PostRepository, JwtAuthGuard, RolesGuard],
  exports: [PostsService],
})
export class PostsBoModule {}
