import { Formik } from 'formik';
import { Button, DatePicker, Form, Input, message, Modal, Upload } from 'antd';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { createPortal } from 'react-dom';
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import type { GetProp, UploadProps } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';

type Props = {
  isOpen: boolean;
  handleNewAd: (values) => void;
  handleCancel: () => void;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const NewAdModal = function ({isOpen, handleNewAd, handleCancel}: Props) {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Please enter ad title'),
    imageUrl: Yup.string(),
    link: Yup.string().url().required('Please enter advertisement url'),
    startDate: Yup.date().required('Please select start date'),
    endDate: Yup.date().required('Please select end date'),
  });
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return createPortal(
    <Modal
      title="Add Advertisement"
      styles={{
        header: {
          color: "red",
        },
      }}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Formik
        initialValues={{
          title: '',
          imageUrl: '',
          link: '',
          startDate: null,
          endDate: null,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          // Handle form submission logic
          console.log(values);
          setSubmitting(false);
          // handleNewAd(values);
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
          <Form
            {...formItemLayout}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="title"
              label="Title"
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
              name="imageUrl"
              label="Image"
            >
              <Upload
                name="imageUrl"
                showUploadList={false}
                beforeUpload={() => false}
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                onChange={(info) => setFieldValue('imageUrl', info.file) }
                listType="picture">
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="link"
              label="AD URL"
              validateStatus={errors.link && touched.link ? 'error' : ''}
              help={errors.link && touched.link ? errors.link : ''}
            >
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.link}
              />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Start Date"
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
                onChange={(date) => setFieldValue('startDate', date.toDate())}
              />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="End Date"
              validateStatus={errors.endDate && touched.endDate ? 'error' : ''}
              help={
                errors.endDate && touched.endDate ? String(errors.endDate) : ''
              }
            >
              <DatePicker
                name="endDate"
                placeholder="End Date"
                onChange={(date) => setFieldValue('endDate', date.toDate())}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </Modal>,
    document.body
  );
}

export default NewAdModal;
