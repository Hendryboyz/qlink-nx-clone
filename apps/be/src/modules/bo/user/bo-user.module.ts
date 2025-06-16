import { Module } from '@nestjs/common';
import { ClientUserController } from '$/modules/bo/user/client-user.controller';
import { UserModule } from '$/modules/user/user.module';
import { BoAuthModule } from '$/modules/bo/auth/auth.module';
import { BoUserController } from '$/modules/bo/user/bo-user.controller';
import { BoUserService } from '$/modules/bo/user/bo-user.service';
import { BoUserRepository } from '$/modules/bo/user/bo-user.repository';

@Module({
  imports: [UserModule, BoAuthModule],
  providers: [BoUserService, BoUserRepository],
  exports: [],
  controllers: [ClientUserController, BoUserController],
})
export class BoUserModule {}
