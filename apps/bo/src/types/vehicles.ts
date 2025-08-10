import { VehicleDTO } from '@org/types';

export interface GetVehiclesResponse {
  data: VehicleDTO[];
  total: number;
}

export interface GetVehiclesFilters {
  model?: string;
  vin?: string;
  engineNumber?: string;
  dealerName?: string;
  year?: number;
  userId?: string;
}
