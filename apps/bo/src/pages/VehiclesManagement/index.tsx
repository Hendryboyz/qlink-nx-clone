import React, { useContext } from 'react';
import { VehiclesContext } from '$/pages/VehiclesManagement/VehiclesContext';
import VehiclesTable from '$/pages/VehiclesManagement/VehiclesTable';

const Index: React.FC = () => {
  return (
    <div>
      <h1>Vehicles Management</h1>
      <VehiclesTable />
    </div>
  );

};

export default Index;
