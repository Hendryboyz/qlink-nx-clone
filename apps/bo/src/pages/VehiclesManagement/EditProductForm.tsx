import React, { useContext } from 'react';
import {
  Divider,
  Row,
  Col,
  Card,
  Form,
  Input,
  DatePicker,
  Space,
  Button,
  Select,
  Flex,
} from 'antd';
import dayjs from 'dayjs';
import { VehiclesContext } from '$/pages/VehiclesManagement/VehiclesContext';
import type { MessageInstance } from 'antd/es/message/interface';
import API from '$/utils/fetch';
import { DEFAULT_MODELS } from '@org/common';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

type FieldType = {
  model: string,
  vin: string;
  engineNumber: string;
  purchaseDate: dayjs.Dayjs;
  registrationDate: dayjs.Dayjs;
  dealerName: string;
};

type EditProductFormProps = {
  messageApi: MessageInstance;
}

type StatusIconProps = {
  isSuccess: boolean;
}

const StatusIcon = (props: StatusIconProps) => {
  const defaultStyle = { fontSize: '30px' };
  if (props.isSuccess) {
    return <CheckCircleFilled style={{ color: 'green', ...defaultStyle }} />;
  } else {
    return <CloseCircleFilled style={{ color: 'red', ...defaultStyle }} />;
  }
}

export default function EditProductForm({ messageApi }: EditProductFormProps) {
  const { editingVehicle, setEditingVehicle } = useContext(VehiclesContext);
  const [form] = Form.useForm();
  console.log(editingVehicle);
  const vehicleValues = {
    ...editingVehicle,
    purchaseDate: dayjs(editingVehicle.purchaseDate, 'YYYY-MM-DD'),
    registrationDate: dayjs(editingVehicle.registrationDate, 'YYYY-MM-DD'),
  };

  async function handleFormSubmit(values: FieldType) {
    const payload = {
      ...values,
      purchaseDate: values.purchaseDate.format(),
      registrationDate: values.registrationDate.format(),
    };
    try {
      const { id } = editingVehicle;
      await API.patchVehicle(id, payload);
      setEditingVehicle(null);
      messageApi.success(`vehicle[${editingVehicle.id}] updated`);
    } catch (e) {
      console.error(e);
      messageApi.error(`something went wrong while updating vehicle`);
    }
  }

  return (
    <>
      <Divider orientation="left">Basic</Divider>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={8}>
          <Card title="Vehicle ID" bordered={false}>
            {editingVehicle.id}
          </Card>
        </Col>
        <Col className="gutter-row" span={8}>
          <Card title="Owner ID" bordered={false}>
            {editingVehicle.memberId}
          </Card>
        </Col>
        <Col className="gutter-row" span={8}>
          <Card title="CRM Status" bordered={false}>
            <Flex justify="space-evenly">
              <Flex vertical style={{ width:'100%', alignItems: 'center' }}>
                <span><StatusIcon isSuccess={editingVehicle.crmId && editingVehicle.crmId !== ""} /></span>
                <strong>Sync</strong>
              </Flex>
              <Flex vertical style={{ width:'100%', alignItems: 'center' }}>
                <span><StatusIcon isSuccess={editingVehicle.isVerified} /></span>
                <strong>Verification</strong>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>
      <Divider orientation="left">Editing</Divider>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="vertical"
        initialValues={vehicleValues}
        style={{
          maxWidth: 600,
          backgroundColor: 'white',
          borderRadius: '5px',
          padding: '15px 0px 15px 25px',
          marginBottom: '30px',
        }}
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="Model"
          name="model"
          rules={[{ required: true, message: 'Please provide model name!' }]}
        >
          <Select>
            {DEFAULT_MODELS.map((model) => (
              <Select.Option key={model.id} value={model.id.toString()}>{model.title}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Year"
          name="year"
          rules={[{ required: false, message: 'Please enter the year!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Vin No."
          name="vin"
          rules={[{ required: true, message: 'Please provide model name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Engine No."
          name="engineNumber"
          rules={[{ required: true, message: 'Please provide model name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Purchase Date" name="purchaseDate">
          <DatePicker style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item label="Registration Date" name="registrationDate">
          <DatePicker style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item
          label="Dealer"
          name="dealerName"
          rules={[{ required: true, message: 'Please provide model name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button htmlType="button" onClick={() => setEditingVehicle(null)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
