import { VehicleDTO } from '@org/types';

export interface GetVehiclesResponse {
  data: VehicleDTO[];
  total: number;
}
