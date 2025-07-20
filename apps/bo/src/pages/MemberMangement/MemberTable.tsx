import React, { useContext } from 'react';
import { UserVO } from '@org/types';
import { Button, Modal, Space } from 'antd';
import API from '$/utils/fetch';
import { ProTable } from '@ant-design/pro-components';
import { MemberContext } from '$/pages/MemberMangement/MemberContext';
import { UserSourceDisplay } from '@org/common';

export default function MemberTable() {

  const {
    members,
    total,
    paging,
    setPaging,
    setMembers,
    setEditingMember,
  } = useContext(MemberContext);
  const onDeleting = (clientId: string) => {
    const client = members.find(c => c.id === clientId);
    Modal.confirm({
      title: 'Confirm to delete user?',
      content: `Do you want to delete ${client.firstName} ${client.midName} ${client.lastName} from Database?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        await API.deleteClientUser(clientId);
        setMembers(prevUsers => prevUsers.filter(c => c.id !== clientId));
      },
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
      title: 'Member ID',
      dataIndex: 'memberId',
      key: 'memberId',
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
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
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
        return (<Space size="middle">{typeIndex ? UserSourceDisplay[source] : '-'}</Space>)
      }
    },
    {
      title: 'Verification Status',
      key: 'VerificationStatus',
      render: () => (<Space>Verified</Space>),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: unknown, record: UserVO) => (
        <Space size="middle">
          <Button onClick={() => { setEditingMember(record) }}>Edit</Button>
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
      // fixed: 'right',
    },
  ];

  return (
    <ProTable
      columns={tableColumns}
      dataSource={members}
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
    />
  );
}
