import React, { useEffect, useState } from 'react';
import { Space, Button, Modal } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import API from '$/utils/fetch';
import { UserSourceType, UserVO } from '@org/types';

const MemberManagement: React.FC = () => {
  const [total, setTotal] = useState(0);
  const [paging, setPaging] = useState({
    pageSize: 10,
    page: 1,
  })
  const [clientUsers, setClientUsers] = useState<UserVO[]>([]);

  const onDeleting = (clientId: string) => {
    const client = clientUsers.find(c => c.id === clientId);
    Modal.confirm({
      title: 'Confirm to delete user?',
      content: `Do you want to delete ${client.firstName} ${client.midName} ${client.lastName} from Database?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {},
    });
  };

  const tableColumns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      hideInTable: true,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Mid Name',
      dataIndex: 'midName',
      key: 'midName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'City',
      dataIndex: 'addressCity',
      key: 'addressCity',
    },
    {
      title: 'State',
      dataIndex: 'addressState',
      key: 'addressState',
    },
    {
      title: 'Facebook ID',
      dataIndex: 'facebook',
      key: 'facebook',
    },
    {
      title: 'Whatsapp ID',
      dataIndex: 'whatsapp',
      key: 'whatsapp',
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'registrationDate',
    },
    {
      title: 'Registration Source',
      dataIndex: 'source',
      key: 'RegistrationSource',
      render: (source: string, _) => {
        let typeIndex = +source;
        if (!source || source === '-') {
          typeIndex = 0
        }
        return (<Space size="middle">{typeIndex ? UserSourceType[typeIndex] : '-'}</Space>)
      }
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: unknown, record: any) => (
        <Space size="middle">
          <Button>Edit</Button>
          <Button
            danger
            onClick={() => {
              onDeleting(record.id);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
      fixed: 'right',
    },
  ];

  useEffect(() => {
    async function fetchClientUsers() {
      const { data, total } = await API.getClientUsers(paging.page, paging.pageSize);
      setClientUsers(data);
      setTotal(total);
      console.log(data, total);
    }
    fetchClientUsers();
  }, [paging]);

  return (
    <div>
      <h1>Member Management</h1>
      <ProTable
        columns={tableColumns}
        dataSource={clientUsers}
        rowKey="id"
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
          // showQuickJumper: true,
        }}
        scroll={{ x: 'max-content' }}
        dateFormatter="string"
        // toolBarRender={() => [
        //   <Button key="button" type="primary">
        //     Add Member
        //   </Button>,
        // ]}
      />
    </div>
  );
};

export default MemberManagement;
