import { Module } from '@nestjs/common';
import { StatisticController } from '$/modules/bo/statistic/statistic.controller';
import { ProductModule } from '$/modules/product/product.module';
import { UserModule } from '$/modules/user/user.module';
import { VerificationModule } from '$/modules/bo/verification/verification.module';

@Module({
  imports: [ProductModule, UserModule, VerificationModule],
  controllers: [StatisticController],
})
export class StatisticModule {}
