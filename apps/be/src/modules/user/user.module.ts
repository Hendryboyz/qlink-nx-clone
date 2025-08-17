import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { StorageModule } from '$/modules/upload/storage.module';
import { CrmModule } from '$/modules/crm/crm.module';
import { UserAnalysisService } from '$/modules/user/user-analysis.service';

@Module({
  imports: [StorageModule, CrmModule],
  providers: [UserService, UserAnalysisService, UserRepository],
  exports: [UserService, UserAnalysisService],
  controllers: [UserController]
})
export class UserModule {}
