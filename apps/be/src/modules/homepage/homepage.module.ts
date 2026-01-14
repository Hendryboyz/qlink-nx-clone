import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { StorageModule } from '$/modules/upload/storage.module';
import { ConfigModule } from '@nestjs/config';
import { PostsManagementModule } from '$/modules/bo/posts/posts.module';
import { BannersModule } from '$/modules/bo/banners/banners.module';
import { BannersController } from '$/modules/homepage/banners.controller';

@Module({
  imports: [
    StorageModule,
    ConfigModule,
    PostsManagementModule,
    BannersModule,
  ],
  controllers: [PostsController, BannersController],
})
export class HomepageModule {}
