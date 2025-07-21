import { ProColumns } from '@ant-design/pro-table/es/typing';
import { dateTimeFormatter } from '$/utils/formatter';
import { Button, Form, Input, Modal, Space, message } from 'antd';
import React, { ReactElement, useContext, useState } from 'react';
import { UserContext } from '$/pages/UsersManagement/UsersContext';
import { ProTable } from '@ant-design/pro-components';
import API from '$/utils/fetch';

export default function UserTable(): ReactElement {
  const {
    users,
    total,
    paging,
    deleteUser,
    setPaging,
    setIsCreatingUser,
  } = useContext(UserContext);

  const [resetPasswordUser, setResetPasswordUser] = useState(undefined);

  const tableColumns: ProColumns[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      hideInTable: true,
      search: false,
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
      search: false,
      render: (data, _) => {
        const date = dateTimeFormatter.format(new Date(data as string))
        return <span>{date}</span>;
      },
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLoginAt',
      key: 'lastLogin',
      search: false,
      render: (data, _) => {
        const date = dateTimeFormatter.format(new Date(data as string))
        return <span>{date}</span>;
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
            onClick={() => handleDeleteBoUser(record.id)}
          >
            Delete
          </Button>
          <Button
            onClick={() => setResetPasswordUser(record)}
          >
            Reset Password
          </Button>
        </Space>
      ),
    },
  ];

  function handleDeleteBoUser(boUserId: string) {
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

  const [form] = Form.useForm();
  async function handleResetPassword() {
    const values = await form.validateFields();
    const payload = {
      password: values.password,
      rePassword: values.confirmPassword,
    }
    try {
      const result = await API.resetBoUserPassword(resetPasswordUser.id, payload);
      if (result !== 0) {
        message.success(`Update password successfully!`);
        form.resetFields();
        setResetPasswordUser(undefined);
      } else {
        message.error('Failed to update password! Please try later.');
      }
    } catch (error) {
      console.error(error);
    }
  }
  function cancelResetPassword() {
    setResetPasswordUser(undefined);
    form.resetFields();
  }

  return (
    <>
      <ProTable
        columns={tableColumns}
        dataSource={users}
        rowKey="id"
        beforeSearchSubmit={(params) => {
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
          // showQuickJumper: true,
        }}
        scroll={{ x: 'max-content' }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            onClick={() => setIsCreatingUser(true)}
          >
            Add User
          </Button>,
        ]}
      />
      {resetPasswordUser && (
        <Modal
          open={true}
          title={`Reset ${resetPasswordUser.username}'s password`}
          okText="confirm"
          onCancel={cancelResetPassword}
          onOk={handleResetPassword}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input the password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[
                { required: true, message: 'Please input the password!' },
                ({getFieldValue}) => ({
                  validator: (_, value) => {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The new password that you entered do not match!'));
                  }
                })
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
}
