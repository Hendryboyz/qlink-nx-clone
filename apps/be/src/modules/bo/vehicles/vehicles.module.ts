import { Module } from '@nestjs/common';
import { VehiclesController } from '$/modules/bo/vehicles/vehicles.controller';
import { ProductModule } from '$/modules/product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [VehiclesController],
})
export class VehiclesModule {}
