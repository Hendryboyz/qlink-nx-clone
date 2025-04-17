import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { StorageModule } from '$/modules/upload/storage.module';

@Module({
  imports: [StorageModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
