import { Module } from '@nestjs/common';
import { ClientUserController } from '$/modules/bo/user/client-user.controller';
import { UserModule } from '$/modules/user/user.module';
import { BoAuthModule } from '$/modules/bo/auth/auth.module';
import { BoUserController } from '$/modules/bo/user/bo-user.controller';

@Module({
  imports: [UserModule, BoAuthModule],
  providers: [],
  exports: [],
  controllers: [ClientUserController, BoUserController],
})
export class BoUserModule {}
