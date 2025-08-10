import { ProductBoVO } from '../product';

export type VehicleDTO = Omit<ProductBoVO, 'createdAt' | 'updatedAt' | 'verifyTimes'> & { isAutoVerified: boolean };
export type ListVehicleDto = {
  data: VehicleDTO[];
  total: number;
}
