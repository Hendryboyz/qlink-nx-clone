import { ProductEntity } from '../product';

export type VehicleDTO = Omit<ProductEntity, 'verifyTimes'> | { isAutoVerified: boolean };
export type ListVehicleDto = {
  data: VehicleDTO[];
  total: number;
}
