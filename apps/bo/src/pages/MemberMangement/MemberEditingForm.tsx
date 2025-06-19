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
import { UserSourceType } from '@org/types';


export default function MemberEditingForm() {
  const {editingMember, setEditingMember} = useContext(MemberContext);
  function valueChangeHandler(values: any) {
  }

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{ size: 'default' }}
      // onValuesChange={valueChangeHandler}
      style={{ maxWidth: 600 }}
      onFinish={() => {}}
    >
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: 'Please input the first name!' }]}
      >
        <Input defaultValue={editingMember.firstName} />
      </Form.Item>
      <Form.Item
        label="Mid Name"
        name="midName"
        rules={[{ required: false, message: 'Please input the mid name!' }]}
      >
        <Input defaultValue={editingMember.midName} />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: 'Please input the last name!' }]}
      >
        <Input defaultValue={editingMember.lastName} />
      </Form.Item>
      <Form.Item label="Birthday" name="birthday">
        <DatePicker
          defaultValue={
            editingMember.birthday &&
            dayjs(editingMember.birthday, 'YYYY-MM-DD')
          }
        />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input defaultValue={editingMember.email} disabled />
      </Form.Item>
      <Form.Item label="Mobile" name="phone">
        <Input value={editingMember.phone} disabled />
      </Form.Item>
      <Form.Item label="City" name="addressCity" rules={[{ required: true, message: 'Please input the city!' }]}>
        <Input defaultValue={editingMember.addressCity} />
      </Form.Item>
      <Form.Item label="State" name="addressState">
        <Select defaultValue={editingMember.addressState}>
          {STATES.map((state) => (
            <Select.Option key={state} value="state">{state}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Facebook ID" name="facebook">
        <Input defaultValue={editingMember.facebook} />
      </Form.Item>
      <Form.Item label="Whatsapp ID" name="whatsapp">
        <Input defaultValue={editingMember.whatsapp} />
      </Form.Item>
      <Form.Item label="Registration Source" name="source">
        <Select defaultValue={UserSourceDisplay[editingMember.source]}>
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
          <Button htmlType="submit">Save</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
