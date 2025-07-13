import { ProColumns } from '@ant-design/pro-table/es/typing';
import { dateTimeFormatter } from '$/utils/formatter';
import { Button, Modal, Space } from 'antd';
import React, { ReactElement, useContext } from 'react';
import { UserContext } from '$/pages/UsersManagement/UsersContext';
import { ProTable } from '@ant-design/pro-components';
import API from '$/utils/fetch';

export default function UserTable(): ReactElement {
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
      dataIndex: 'lastLoginAt',
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
          <Button
            danger
            onClick={() => onDeleteBoUser(record.id)}
          >
            Delete
          </Button>
          <Button>Reset Password</Button>
        </Space>
      ),
    },
  ];
  const {
    users,
    total,
    paging,
    deleteUser,
    setPaging,
    setEditingUserId,
  } = useContext(UserContext);
  function onDeleteBoUser(boUserId: string) {
    const deletingUser = users.find(u => u.id === boUserId);
    Modal.confirm({
      title: 'Confirm to delete user?',
      content: `Do you want to delete ${deletingUser.username}[${deletingUser.role}] from Database?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await API.deleteBoUser(deletingUser.id);
          deleteUser(deletingUser.id);
        } catch (error) {
          console.error(error);
        }
      },
    });
  }
  return (
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
      toolBarRender={() => [
        <Button
          key="button"
          type="primary"
          onClick={() => setEditingUserId(null)}
        >
          Add User
        </Button>,
      ]}
    />
  );
}
