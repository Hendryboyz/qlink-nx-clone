import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database.module';
import { ProductModule } from './modules/product/product.module';
import { PostsModule } from './modules/posts/posts.module';
import { StorageModule } from '$/modules/upload/storage.module';
import { NotificationModule } from './notification/notification.module';
import { VerificationModule } from './modules/bo/verification/verification.module';
import { CrmModule } from './modules/crm/crm.module';
import { TaskService } from '$/app/task.serivce';
import { ScheduleModule } from '@nestjs/schedule';
import { BoModule } from '$/modules/bo/bo.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    NotificationModule,
    VerificationModule,
    CrmModule,
    UserModule,
    AuthModule,
    ProductModule,
    StorageModule,
    PostsModule,
    BoModule,
  ],
  providers: [TaskService],
})
export class AppModule {}
