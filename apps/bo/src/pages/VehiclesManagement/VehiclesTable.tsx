import { ProColumns } from '@ant-design/pro-table/es/typing';
import { dateTimeFormatter } from '$/utils/formatter';
import { Button, message, Modal, Space, Tooltip } from 'antd';
import React, { ReactElement, useContext, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { VehiclesContext } from '$/pages/VehiclesManagement/VehiclesContext';
import { FileDoneOutlined, LoadingOutlined } from '@ant-design/icons';
import { VehicleDTO } from '@org/types';
import API from '$/utils/fetch';
import { DEFAULT_MODELS } from '@org/common';

export default function VehiclesTable(): ReactElement {
  const {
    vehicles,
    setVehicles,
    total,
    paging,
    setPaging,
    setFilterParams,
    setEditingVehicle,
  } = useContext(VehiclesContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [verifying, setVerifying] = useState(false);

  async function handleReVerify() {
    try {
      setVerifying(true);
      const syncResults = await API.verifyAllVehicles();
      const successCount = syncResults.reduce((count: number, result) =>
        count + (result.isVerified ? 1 : 0), 0);
      const failureCount = syncResults.length - successCount;
      message.info(
        `try to re-sync ${syncResults.length} products: success: ${successCount}, failure: ${failureCount}`,
        5,
        );
    } catch(e) {
      message.error('something unexpected error while re-verify vehicles');
    } finally {
      setVerifying(false);
    }
  }

  function handleDelete(vehicleId: string) {
    Modal.confirm({
      title: 'Confirm to delete user?',
      content: `Do you want to delete vehicle[${vehicleId}] from Database?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await API.deleteVehicle(vehicleId);
          setVehicles((prevVehicles: VehicleDTO[]) =>
            prevVehicles.filter(v => v.id !== vehicleId));
        } catch (error) {
          messageApi.open({
            type: 'error',
            content: 'failed to delete vehicle',
          });
          console.error(error);
        }
      },
    });
  }

  const tableColumns: ProColumns[] = [
    {
      title: 'VehicleId',
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      render: (data, _) => {
        const definedModel = DEFAULT_MODELS.find(m => m.id.toString() === data);
        return <span>{definedModel.title}</span>;
      }
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
    //   dataIndex: 'condition',
    //   key: 'condition',
    // },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      search: false,
      render: (data, _) => {
        const date = dateTimeFormatter.format(new Date(data as string))
        return <span>{date}</span>;
      },
    },
    {
      title: 'Registration Date',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      search: false,
      render: (data, _) => {
        const date = dateTimeFormatter.format(new Date(data as string))
        return <span>{date}</span>;
      },
    },
    {
      title: 'Owned Member',
      dataIndex: 'memberId',
      key: 'memberId',
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
      search: false,
      render: (isVerified, record) => {
        let autoVerifyStatus = (
          <Tooltip placement="right" title={"wait for verified process"}>
            <LoadingOutlined />
          </Tooltip>
        );
        if (isVerified) {
          autoVerifyStatus = (
            <Tooltip placement="bottom" title={"verify done, update vehicle info to trigger again"}>
              <FileDoneOutlined style={{ color: '#2DC100' }} />
            </Tooltip>
          )
        }
        if (isVerified) {
          return (
            <div className="flex">
              <span style={{paddingRight: '5px', color: '#2DC100'}}>Success</span>
              {autoVerifyStatus}
            </div>
          );
        } else {
          return (
            <div>
              <span style={{paddingRight: '5px', color: '#EFB700'}}>Pending</span>
              {autoVerifyStatus}
            </div>
          );
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      search: false,
      render: (_: unknown, record: VehicleDTO) => (
        <Space size="middle">
          <Button onClick={() => { setEditingVehicle(record) }}>Edit</Button>
          <Button
            danger
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <ProTable
        columns={tableColumns}
        dataSource={vehicles}
        rowKey="id"
        beforeSearchSubmit={(params) => {
          if (params.memberId) {
            const target = vehicles.find(v => v.memberId === params.memberId);
            params = {
              ...params,
              userId: target.userId,
            };
          }
          setFilterParams(params);
        }}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          onChange: ((page, pageSize) => {
            setPaging({page, pageSize});
          }),
          pageSize: paging.pageSize,
          total: total,
          showSizeChanger: true,
        }}
        scroll={{ x: 'max-content' }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            onClick={handleReVerify}
            disabled={verifying}
            loading={verifying}
          >
            ReVerify
          </Button>,
        ]}
      />
    </>
  );
}
