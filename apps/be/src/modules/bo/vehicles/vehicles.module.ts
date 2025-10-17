import { Module } from '@nestjs/common';
import { VehiclesController } from '$/modules/bo/vehicles/vehicles.controller';
import { ProductModule } from '$/modules/product/product.module';
import { VerificationModule } from '$/modules/bo/verification/verification.module';

@Module({
  imports: [ProductModule, VerificationModule],
  controllers: [VehiclesController],
})
export class VehiclesModule {}
