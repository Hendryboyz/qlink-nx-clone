import { Module } from '@nestjs/common';
import { PostsService } from '$/modules/posts/posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from '../../posts/posts.repository';
import { JwtAuthGuard } from '$/modules/bo/auth/jwt-auth.guard';
import { BoAuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/roles.guard';
import { StorageModule } from '$/modules/upload/storage.module';

@Module({
  imports: [BoAuthModule, StorageModule],
  controllers: [PostsController],
  providers: [PostsService, PostRepository, JwtAuthGuard, RolesGuard],
  exports: [PostsService],
})
export class PostsBoModule {}
