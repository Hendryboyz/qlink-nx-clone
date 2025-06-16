import React, { ReactElement, useEffect, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/es/typing';
import { Button, Space } from 'antd';
import API from '$/utils/fetch';
import { dateTimeFormatter } from '$/utils/formatter';


export default function Index(): ReactElement {
  const tableColumns: ProColumns[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      hideInTable: true,
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Create Date',
      dataIndex: 'createdAt',
      key: 'created_at',
      render: (data, _) => {
        const date = dateTimeFormatter.format(new Date(data as string))
        return <span>{date}</span>;
      },
    },
    {
      title: 'Last Login',
      dataIndex: 'createdAt',
      key: 'lastLogin',
      render: (data, _) => {
        const date = dateTimeFormatter.format(new Date(data as string))
        return <span>{date}</span>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: any) => (
        <Space size="middle">
          <Button type="primary">Edit</Button>
          <Button danger>Delete</Button>
          <Button>Reset Password</Button>
        </Space>
      ),
    },
  ];
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [paging, setPaging] = useState({
    pageSize: 10,
    page: 1,
  })
  useEffect(() => {
    async function fetchUser(): Promise<void>  {
      const { data, total } = await API.listBoUsers(paging.page, paging.pageSize);
      setUsers(data);
      setTotal(total);
    }
  fetchUser();
  }, [paging]);
  return (
    <div>
      <h1>BO Users Management</h1>
      <ProTable
        columns={tableColumns}
        dataSource={users}
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
}
