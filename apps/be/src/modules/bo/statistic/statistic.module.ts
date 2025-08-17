import { Module } from '@nestjs/common';
import { StatisticController } from '$/modules/bo/statistic/statistic.controller';
import { ProductModule } from '$/modules/product/product.module';
import { UserModule } from '$/modules/user/user.module';

@Module({
  imports: [ProductModule, UserModule],
  controllers: [StatisticController],
})
export class StatisticModule {}
