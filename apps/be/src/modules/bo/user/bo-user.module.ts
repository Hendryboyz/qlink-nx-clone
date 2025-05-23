import { Module } from '@nestjs/common';
import { BoUserController } from '$/modules/bo/user/bo-user.controller';
import { UserModule } from '$/modules/user/user.module';
import { BoAuthModule } from '$/modules/bo/auth/auth.module';

@Module({
  imports: [UserModule, BoAuthModule],
  providers: [],
  exports: [],
  controllers: [BoUserController],
})
export class BoUserModule {}
