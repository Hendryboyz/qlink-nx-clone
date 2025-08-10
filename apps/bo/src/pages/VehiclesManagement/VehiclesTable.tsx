import { ProColumns } from '@ant-design/pro-table/es/typing';
import { dateTimeFormatter } from '$/utils/formatter';
import { Button, Modal, Space } from 'antd';
import React, { ReactElement, useContext } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { VehiclesContext } from '$/pages/VehiclesManagement/VehiclesContext';

export default function VehiclesTable(): ReactElement {
  const {
    vehicles,
    total,
    paging,
    setPaging,
  } = useContext(VehiclesContext);

  const pageCursor = vehicles.length > 0 && vehicles[vehicles.length - 1].id;

  const tableColumns: ProColumns[] = [
    {
      title: 'VehicleId',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Vin Number',
      dataIndex: 'vin',
      key: 'vin',
    },
    {
      title: 'Engine Serial Number',
      dataIndex: 'engineNumber',
      key: 'engineNumber',
    },
    // {
    //   title: 'Condition',
    //   dataIndex: 'role',
    //   key: 'role',
    // },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (data, _) => {
        const date = dateTimeFormatter.format(new Date(data as string))
        return <span>{date}</span>;
      },
    },
    {
      title: 'Registration Date',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (data, _) => {
        const date = dateTimeFormatter.format(new Date(data as string))
        return <span>{date}</span>;
      },
    },
    {
      title: 'Owned Member',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Dealer Name',
      dataIndex: 'dealerName',
      key: 'dealerName',
    },
    {
      title: 'Verification Status',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified, _) => {
        if (isVerified) {
          return <span>Yes</span>;
        } else {
          return <span>No</span>;
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      search: false,
      render: (_: unknown, record: any) => (
        <Space size="middle">
          <Button
            danger
            onClick={() => {}}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  function handleDelete(vehicleId: string) {
    // const deletingVehicle = vehicles.find(v => v.id === vehicleId);
    Modal.confirm({
      title: 'Confirm to delete user?',
      content: `Do you want to delete vehicle from Database?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
      },
    });
  }



  return (
    <ProTable
      columns={tableColumns}
      dataSource={vehicles}
      rowKey="id"
      beforeSearchSubmit={(params) => {
      }}
      search={false}
      pagination={{
        onChange: ((page, pageSize) => {
          setPaging({cursor: pageCursor, page, pageSize});
        }),
        pageSize: paging.pageSize,
        total: total,
        showSizeChanger: true,
      }}
      scroll={{ x: 'max-content' }}
      dateFormatter="string"
      toolBarRender={undefined}
    />
  );
}
