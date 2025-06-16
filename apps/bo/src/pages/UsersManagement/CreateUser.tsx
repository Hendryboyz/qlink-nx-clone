import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreateBoUserDto, BoRole } from '@org/types';
import API from '$/utils/fetch';

const { Option } = Select;

const CreateUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: CreateBoUserDto) => {
    setLoading(true);
    try {
      await API.post('/auth/create-user', values);
      message.success('User created successfully');
      navigate('/dashboard'); // Assuming you have a users list page
    } catch (error) {
      message.error('Failed to create user');
      console.error('Create user error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h1>Create New User</h1>
      <Form name="createUser" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input the username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input the password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select>
            <Option value={BoRole.ADMIN}>Admin</Option>
            <Option value={BoRole.VIEWER}>Agent</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateUser;
