import { createContext, ReactNode, useEffect, useState } from 'react';
import { VehicleDTO } from '@org/types';
import API from '$/utils/fetch';

type pagingType = {
  cursor: string;
  pageSize: number;
  page: number;
};

interface VehiclesContextType {
  editingVehicle: VehicleDTO;
  vehicles: VehicleDTO[];
  total: number;
  paging: pagingType;
  setPaging: (prevState) => void;
  setFilterParams: (prevState) => void;
  setVehicles: (prevState) => void;
  setEditingVehicle: (prevState) => void;
  reloadVehicles: () => void;
}

const INITIAL_STATE: VehiclesContextType = {
  editingVehicle: null,
  vehicles: [],
  total: 0,
  paging: {
    cursor: '',
    pageSize: 10,
    page: 1,
  },
  setPaging: (prevState) => {},
  setFilterParams: (prevState) => {},
  setVehicles: (prevState) => {},
  setEditingVehicle: (prevState) => {},
  reloadVehicles: () => {},
}

export const VehiclesContext = createContext<VehiclesContextType>(INITIAL_STATE);

const INITIAL_PAGING_VALUES = {
  cursor: "",
  page: 1,
  pageSize: 10,
};


export default function VehiclesContextProvider({ children }: { children: ReactNode }) {
  const [editingVehicle, setEditingVehicle] = useState<VehicleDTO>(null);
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [paging, setPaging] = useState(INITIAL_PAGING_VALUES);
  const [filterParams, setFilterParams] = useState(undefined);
  const [refreshCounter, setRefreshCounter] = useState(0);

  function reloadVehicles() {
    setRefreshCounter(prev => prev + 1);
  }

  useEffect(() => {
    async function fetchVehicles() {
      const { data, total } = await API.listVehicles(
        paging.page, paging.pageSize, filterParams);
        setVehicles(data);
        setTotal(total);
    }
    fetchVehicles();
  }, [paging, filterParams, setVehicles, refreshCounter]);

  const ctxValues: VehiclesContextType = {
    editingVehicle,
    vehicles,
    total,
    paging,
    setPaging,
    setFilterParams,
    setVehicles,
    setEditingVehicle,
    reloadVehicles,
  }
  return (
    <VehiclesContext.Provider value={ctxValues}>
      {children}
    </VehiclesContext.Provider>
  );
}
