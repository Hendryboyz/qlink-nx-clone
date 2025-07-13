import React, { useContext, useState } from 'react';
import { Form, Input, Button, Select, message, Space } from 'antd';
// import { useNavigate } from 'react-router-dom';
import { CreateBoUserDto, BoRole } from '@org/types';
import API from '$/utils/fetch';
import { UserContext } from '$/pages/UsersManagement/UsersContext';

const { Option } = Select;

const CreateUser: React.FC = () => {
  const {setEditingUserId} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  const onFinish = async (values: CreateBoUserDto) => {
    setLoading(true);
    try {
      await API.createUser(values);
      message.success('User created successfully');
      // navigate('/users'); // Assuming you have a users list page
      setEditingUserId(undefined);
    } catch (error) {
      message.error('Failed to create user');
      console.error('Create user error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'white',
      padding: '20px 20px',
      marginBottom: '20px',
      borderRadius: '8px',
    }}>
      <Form
        style={{
          maxWidth: 400,
          margin: '40px auto',
        }}
        name="createUser"
        onFinish={onFinish}
        layout="vertical">
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

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select>
            <Option value={BoRole.ADMIN}>Admin</Option>
            <Option value={BoRole.VIEWER}>Viewer</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              htmlType="button"
              onClick={() => setEditingUserId(undefined)}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create User
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateUser;
