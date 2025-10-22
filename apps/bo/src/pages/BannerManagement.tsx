import React, { useState } from 'react';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { DragSortTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, DatePicker, message, Space } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { UserVO } from '@org/types';
import { EditOutlined, StopOutlined } from '@ant-design/icons';

type AddBannerModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const AddBannerModal: React.FC<AddBannerModalProps> = ({isModalVisible, setIsModalVisible}: AddBannerModalProps) => {
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Please enter ad title'),
    content: Yup.string().required('Please enter ad content'),
    startDate: Yup.date().required('Please select start date'),
    endDate: Yup.date().required('Please select end date'),
  });

  return (
    <Modal
      title="Add Advertisement"
      open={isModalVisible}
      onCancel={handleCloseModal}
      footer={null}
    >
      <Formik
        initialValues={{
          title: '',
          content: '',
          startDate: null,
          endDate: null,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          // Handle form submission logic
          setSubmitting(false);
          handleCloseModal();
        }}
      >
        {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
          <Form onFinish={handleSubmit}>
            <Form.Item
              name="title"
              validateStatus={errors.title && touched.title ? 'error' : ''}
              help={errors.title && touched.title ? errors.title : ''}
            >
              <Input
                name="title"
                placeholder="Ad Title"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
              />
            </Form.Item>
            <Form.Item
              name="content"
              validateStatus={
                errors.content && touched.content ? 'error' : ''
              }
              help={errors.content && touched.content ? errors.content : ''}
            >
              <Input.TextArea
                name="content"
                placeholder="Ad Content"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.content}
              />
            </Form.Item>
            <Form.Item
              name="startDate"
              validateStatus={
                errors.startDate && touched.startDate ? 'error' : ''
              }
              help={
                errors.startDate && touched.startDate
                  ? String(errors.startDate)
                  : ''
              }
            >
              <DatePicker
                name="startDate"
                placeholder="Start Date"
                onChange={(date) => setFieldValue('startDate', date)}
              />
            </Form.Item>
            <Form.Item
              name="endDate"
              validateStatus={
                errors.endDate && touched.endDate ? 'error' : ''
              }
              help={
                errors.endDate && touched.endDate
                  ? String(errors.endDate)
                  : ''
              }
            >
              <DatePicker
                name="endDate"
                placeholder="End Date"
                onChange={(date) => setFieldValue('endDate', date)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </Modal>
  )
};

const enabledTableColumns: ProColumns[] = [
  {
    title: 'order',
    dataIndex: 'sort',
    width: 60,
    className: 'drag-visible',
  },
  {
    dataIndex: 'id',
    key: 'id',
    hideInTable: true,
    search: false,
  },
  {
    dataIndex: 'order',
    key: 'order',
    hideInTable: true,
    search: false,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Subtitle',
    dataIndex: 'subtitle',
    key: 'subtitle',
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
  },
  {
    title: 'Link URL',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Actions',
    key: 'actions',
    search: false,
    render: (_: unknown, record: UserVO) => (
      <Space size="middle">
        <Button
          variant='link'
          color='default'
          onClick={() => {}}>
          <EditOutlined style={{ fontSize: 16 }} />
        </Button>
        <Button
          variant='link'
          color='danger'
          onClick={() => {}}
        >
          <StopOutlined style={{ fontSize: 16 }} />
        </Button>
      </Space>
    ),
  },
];

const enabledData = [
  {
    id: '1',
    order: 0,
    title: 'title 1',
    subtitle: 'subtitle 1',
    enabled: true,
  },
  {
    id: '2',
    order: 1,
    title: 'title 2',
    subtitle: 'subtitle 2',
    enabled: true,
  },
  {
    id: '3',
    order: 2,
    title: 'title 3',
    subtitle: 'subtitle 3',
    enabled: true,
  },
  {
    id: '4',
    order: NaN,
    title: 'title 4',
    subtitle: 'subtitle 4',
    enabled: true,
  },
];

const disabledTableColumns: ProColumns[] = [
  {
    dataIndex: 'id',
    key: 'id',
    hideInTable: true,
    search: false,
  },
  {
    dataIndex: 'order',
    key: 'order',
    hideInTable: true,
    search: false,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Subtitle',
    dataIndex: 'subtitle',
    key: 'subtitle',
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
  },
  {
    title: 'Link URL',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Actions',
    key: 'actions',
    search: false,
    render: (_: unknown, record: UserVO) => (
      <Space size="middle">
        <Button
          color="primary"
          variant="solid"
          onClick={() => {}}
        >
          Enabled
        </Button>
        <Button
          danger
          onClick={() => {}}
        >
          Delete
        </Button>
      </Space>
    ),
  },
];


const disabledData = [5, 6, 7, 8, 9, 10, 11].map((num: number) => (
  {
    id: num.toString(),
    order: num,
    title: `title ${num}`,
    subtitle: `subtitle ${num}`,
    enabled: true,
  }
));


const BannerManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const [dataSource, setDataSource] = useState(enabledData);

  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any[],
  ) => {
    console.debug('sorted data', newDataSource);
    newDataSource = newDataSource.map((data, idx) => ({
      ...data,
      order: idx,
    }));
    setDataSource(newDataSource);
    const orderUpdatedPayload = newDataSource.map(item => ({
      id: item.id,
      order: item.order,
    }));
    console.debug('sorted payload', orderUpdatedPayload);
    message.success('revise list order success');
  };

  return (
    <div>
      <h1>Banner Management</h1>
      <DragSortTable
        options={{
          reload: false,
          density: false,
          setting: false,
        }}
        headerTitle="Enabled Items"
        columns={enabledTableColumns}
        dataSource={dataSource}
        rowKey="id"
        // search={{
        //   labelWidth: 'auto',
        // }}
        dragSortKey='sort'
        search={false}
        pagination={false}
        onDragSortEnd={handleDragSortEnd}
        dateFormatter="string"
        toolBarRender={() => [
          <Button key="button" type="primary" onClick={showModal}>
            Add Advertisement
          </Button>,
        ]}
        style={{ marginBottom: '32px' }}
      />
      <ProTable
        options={{
          reload: false,
          density: false,
          setting: false,
        }}
        headerTitle="Disabled Items"
        columns={disabledTableColumns}
        dataSource={disabledData}
        rowKey="id"
        // search={{
        //   labelWidth: 'auto',
        // }}
        search={false}
        pagination={false}
      />
      <AddBannerModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
    </div>
  );
};

export default BannerManagement;
