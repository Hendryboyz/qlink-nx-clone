import { ProductEntity } from '../product';

export type VehicleDTO = Omit<ProductEntity, 'createdAt' | 'updatedAt' | 'verifyTimes'> & { isAutoVerified: boolean };
export type ListVehicleDto = {
  data: VehicleDTO[];
  total: number;
}
