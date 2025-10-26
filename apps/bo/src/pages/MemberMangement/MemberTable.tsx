import React, { useContext } from 'react';
import { UserVO } from '@org/types';
import { Button, Modal, Select, Space } from 'antd';
import API from '$/utils/fetch';
import { ProTable } from '@ant-design/pro-components';
import { MemberContext } from '$/pages/MemberMangement/MemberContext';
import { STATES, UserSourceDisplay } from '@org/common';

export default function MemberTable() {

  const {
    members,
    total,
    paging,
    setPaging,
    setFilterParams,
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
      search: false,
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
      search: false,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      search: false,
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
      renderFormItem: (
        dom,
        { type, defaultRender, ...rest },
        form) => {
        return (
          <Select
            {...rest}
            onChange={(val) =>{
              form.setFieldValue(dom.key, val);
            }}
          >
            {STATES.map((state) => (
              <Select.Option key={state} value={state}>{state}</Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Facebook ID',
      dataIndex: 'facebook',
      key: 'facebook',
      search: false,
    },
    {
      title: 'Whatsapp ID',
      dataIndex: 'whatsapp',
      key: 'whatsapp',
      search: false,
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'registrationDate',
      search: false,
    },
    {
      title: 'Registration Source',
      dataIndex: 'source',
      key: 'RegistrationSource',
      search: false,
      render: (source: string, _) => {
        let typeIndex = +source;
        if (!source || source === '-') {
          typeIndex = 0
        }
        return (<Space size="middle">{typeIndex ? UserSourceDisplay[source] : '-'}</Space>)
      }
    },
    {
      title: 'Actions',
      key: 'action',
      search: false,
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
      beforeSearchSubmit={(params) => {
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
        // showQuickJumper: true,
      }}
      scroll={{ x: 'max-content' }}
      dateFormatter="string"
    />
  );
}
