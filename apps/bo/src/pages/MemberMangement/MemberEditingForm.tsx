import React, { useContext } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
} from 'antd';
import { MemberContext } from '$/pages/MemberMangement/MemberContext';
import dayjs from 'dayjs';
import { STATES, typedObjectEntries, UserSourceDisplay } from '@org/common';
import { UserSourceType, UserVO } from '@org/types';
import API from '$/utils/fetch';

type FieldType = {
  firstName: string;
  midName?: string;
  lastName: string;
  birthday: dayjs.Dayjs;
  email: string;
  phone: string;
  addressCity: string;
  addressState: string;
  facebook?: string;
  whatsapp?: string;
  source?: number;
};


export default function MemberEditingForm() {
  const {editingMember, setEditingMember, setMembers} = useContext(MemberContext);
  const [form] = Form.useForm();

  function valueChangeHandler(values: any) {
  }

  const userValues = {
    firstName: editingMember.firstName,
    midName: editingMember.midName,
    lastName: editingMember.lastName,
    birthday: editingMember.birthday &&
                dayjs(editingMember.birthday, 'YYYY-MM-DD'),
    email: editingMember.email,
    phone: editingMember.phone,
    addressCity: editingMember.addressCity,
    addressState: editingMember.addressState,
    facebook: editingMember.facebook,
    whatsapp: editingMember.whatsapp,
    source: editingMember.source,
  }

  async function handleFormSubmit(values: FieldType) {
    const payload = {
      ...values,
      birthday: values.birthday.format(),
    };
    try {
      const updatedUsers = await API.patchClientUser(editingMember.id, payload);
      if (updatedUsers !== undefined && updatedUsers !== null) {
        setMembers((prevUsers: UserVO[]) => {
          return prevUsers.map(u => {
            if (u.id === editingMember.id) {
              return { id: u.id };
            }
            return u;
          });
        });
        setEditingMember(null);
      }
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      layout="vertical"
      initialValues={userValues}
      onValuesChange={valueChangeHandler}
      style={{
        maxWidth: 600,
        backgroundColor: 'white',
        borderRadius: '5px',
        padding: '15px 0px 15px 25px',
        marginBottom: '30px',
      }}
      onFinish={handleFormSubmit}
    >
      <Form.Item label="Email" name="email">
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: 'Please input the first name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mid Name"
        name="midName"
        rules={[{ required: false, message: 'Please input the mid name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: 'Please input the last name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Birthday" name="birthday">
        <DatePicker />
      </Form.Item>
      <Form.Item label="Mobile" name="phone">
        <Input  />
      </Form.Item>
      <Form.Item label="City" name="addressCity" rules={[{ required: true, message: 'Please input the city!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="State" name="addressState">
        <Select>
          {STATES.map((state) => (
            <Select.Option key={state} value={state}>{state}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Facebook ID" name="facebook">
        <Input />
      </Form.Item>
      <Form.Item label="Whatsapp ID" name="whatsapp">
        <Input />
      </Form.Item>
      <Form.Item label="Registration Source" name="source">
        <Select>
          {typedObjectEntries(UserSourceType)
            .filter(([k, v]) => {
              return isNaN(Number(k)) && v !== UserSourceType.NONE;
            })
            .map(([_, v]) => (
              <Select.Option key={v} value={v}>{UserSourceDisplay[v]}</Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button htmlType="button" onClick={() => setEditingMember(null)}>Cancel</Button>
          <Button type='primary' htmlType="submit">Save</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
