import { ProductBoVO } from '../product';

export type VehicleDTO = Omit<ProductBoVO, 'userId' | 'createdAt' | 'updatedAt' | 'verifyTimes'> & { isAutoVerified: boolean };
export type ListVehicleDto = {
  data: VehicleDTO[];
  total: number;
}
