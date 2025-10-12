import React, { useContext } from 'react';
import { VehiclesContext } from '$/pages/VehiclesManagement/VehiclesContext';
import VehiclesTable from '$/pages/VehiclesManagement/VehiclesTable';
import EditProductForm from '$/pages/VehiclesManagement/EditProductForm';
import useMessage from 'antd/es/message/useMessage';

const Index: React.FC = () => {
  const {editingVehicle} = useContext(VehiclesContext);
  const [messageApi, contextHolder] = useMessage();
  return (
    <div>
      {contextHolder}
      <h1>Vehicles Management</h1>
      {editingVehicle &&  <EditProductForm messageApi={messageApi} />}
      {!editingVehicle &&  <VehiclesTable />}
    </div>
  );

};

export default Index;
