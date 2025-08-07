import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database.module';
import { ProductModule } from './modules/product/product.module';
import { BoAuthModule } from './modules/bo/auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { PostsModule } from './modules/posts/posts.module';
import { PostsBoModule } from './modules/bo/posts/posts.module';
import { StorageModule } from '$/modules/upload/storage.module';
import { BoUserModule } from '$/modules/bo/user/bo-user.module';
import { NotificationModule } from './notification/notification.module';
import { VerificationModule } from './modules/bo/verification/verification.module';
import { CrmModule } from './modules/crm/crm.module';
import { TaskService } from '$/app/task.serivce';
import { ScheduleModule } from '@nestjs/schedule';
import { VehiclesModule } from './modules/bo/vehicles/vehicles.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ProductModule,
    PostsModule,
    BoAuthModule,
    PostsBoModule,
    BoUserModule,
    VehiclesModule,
    StorageModule,
    RouterModule.register([
      {
        path: 'bo',
        children: [
          {
            path: 'posts',
            module: PostsBoModule,
          },
          {
            path: 'auth',
            module: BoAuthModule,
          },
          {
            path: 'users',
            module: BoUserModule,
          },
          {
            path: 'vehicles',
            module: VehiclesModule,
          },
        ],
      },
    ]),
    NotificationModule,
    VerificationModule,
    CrmModule,
  ],
  providers: [TaskService],
})
export class AppModule {}
