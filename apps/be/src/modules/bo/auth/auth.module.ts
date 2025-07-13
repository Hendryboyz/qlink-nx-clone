import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BoAuthService } from './auth.service';
import { BoAuthController } from './auth.controller';
import { BoAuthRepository } from './auth.repository';
import { VerificationModule } from '$/modules/bo/verification/verification.module';
import { BoUserModule } from '$/modules/bo/user/bo-user.module';

@Module({
  imports: [ConfigModule, VerificationModule, BoUserModule],
  controllers: [BoAuthController],
  providers: [BoAuthService, BoAuthRepository],
  exports: [BoAuthService],
})
export class BoAuthModule {}
