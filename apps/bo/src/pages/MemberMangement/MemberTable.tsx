import React, { useContext, useEffect, useState } from 'react';
import { UserVO } from '@org/types';
import { Button, Modal, Select, Space, message } from 'antd';
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

  const [messageApi, contextHolder] = message.useMessage();

  const [verifying, setVerifying] = useState({});
  function setVerifyMember(clientId: string, isVerifying: boolean) {
    setVerifying((prevState) => ({
      ...prevState,
      [clientId]: isVerifying,
    }));
  }

  useEffect(() => {
    const memberVerifying = {};
    for (const member of members) {
      memberVerifying[member.id] = false;
    }
    setVerifying(memberVerifying);
  }, members);

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

  const onVerifyMember = async (clientId: string)=> {
    setVerifyMember(clientId, true);
    try {
      const newCrmId = await API.verifyClientUser(clientId);
      setMembers(prevUsers => {
        const syncedMember = prevUsers.find(c => c.id === clientId);
        syncedMember.crmId = newCrmId;
        const otherMembers = prevUsers.filter(c => c.id !== clientId);
        return [syncedMember, ...otherMembers];
      });
      messageApi.success(`sync successfully.`);
    } catch (error) {
      console.error(error);
      messageApi.error('fail to sync member, please collect your use case and notify administrator.')
    } finally {
      setVerifyMember(clientId, false);
    }
  }

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
      title: 'Verification Status',
      key: 'VerificationStatus',
      search: false,
      render: (_, user) => {
        if (user && user.crmId && user.memberId) {
          return (<Button type="text" disabled>Verified</Button>)
        } else {
          return (
            <Button
              loading={verifying[user.id]}
              onClick={() => onVerifyMember(user.id)}
            >
              {verifying && verifying[user.id] === true ? 'Verifying' : 'Verify'}
            </Button>
          );
        }
      },
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
    <>
      {contextHolder}
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
    </>
  );
}
