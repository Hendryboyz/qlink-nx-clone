import { Module } from '@nestjs/common';
import { ClientUserController } from '$/modules/bo/user/client-user.controller';
import { UserModule } from '$/modules/user/user.module';
import { BoUserController } from '$/modules/bo/user/bo-user.controller';
import { BoUserService } from '$/modules/bo/user/bo-user.service';
import { BoUserRepository } from '$/modules/bo/user/bo-user.repository';
import { VerificationModule } from '$/modules/bo/verification/verification.module';

@Module({
  imports: [UserModule, VerificationModule],
  providers: [BoUserService, BoUserRepository],
  exports: [BoUserService],
  controllers: [ClientUserController, BoUserController],
})
export class BoUserModule {}
