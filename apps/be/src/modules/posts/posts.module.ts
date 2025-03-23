import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from '$/modules/posts/posts.repository';
import { StorageModule } from '$/modules/upload/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
  exports: [PostsService],
})
export class PostsModule {}
