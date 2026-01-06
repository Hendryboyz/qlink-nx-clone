import { Formik } from 'formik';
import { Button, Form, Input, Space, Card, Radio, Upload, message } from 'antd';
import * as Yup from 'yup';
import { PlusOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import React, { useCallback, useEffect, useState } from 'react';
import API from '$/utils/fetch';
import { CODE_SUCCESS } from '@org/common';
import { BannerAlignment, BannerDto } from '@org/types';

type EditBannerProps = {
  // * null initialValues to add a new banner
  // * defined initialValues to update banner
  initialValues?: BannerDto;
  onCancel: () => void;
};

const validationSchema = Yup.object().shape({
  label: Yup.string(),
  title: Yup.string().required('please enter title'),
  subtitle: Yup.string(),
  alignment: Yup.mixed<BannerAlignment>().oneOf(Object.values(BannerAlignment)).required(),
  button: Yup.string().required('please enter button text'),
  image: Yup.string().url().nullable(),
  link: Yup
    .string()
    .url()
    .min(6, 'link require at least 6 characters')
    .required('please provide link address'),
});

const emptyBannerValues: BannerDto = {
  id: '',
  order: 0,

  label: '',
  title: '',
  subtitle: '',
  alignment: BannerAlignment.TOP,
  button: 'View',

  image: null,
  link: '',

  archived: false,
}

function EditBannerPage({ initialValues, onCancel }: EditBannerProps) {
  const [previewImage, setPreviewImage] = useState<string>(initialValues?.image || null);

  useEffect(() => {
    if (initialValues) {

    }
  }, []);

  const uploadImage = useCallback(async (file: File | Blob) => {
    return API.uploadBannerImage(file)
      .then((res) => {
        if (res.bizCode !== CODE_SUCCESS) {
          message.error('Upload failed: ' + (res.message || 'Unknown error'));
          return { imageUrl: '' };
        }
        const { imageUrl, s3Uri } = res.data;

        return { imageUrl, s3Uri };
      })
      .catch((error) => {
        message.error(
          'Upload failed: ' + (error.response.data.message || 'Unknown error')
        );
        return { imageUrl: '' , s3Uri: ''};
      });
  }, []);

  const onBackgroundImageUpload = useCallback(
    async (info: UploadChangeParam<UploadFile<File>>)=> {
      const { file } = info;
      let fileToUpload: File | Blob | undefined;

      if (file instanceof File) {
        fileToUpload = file;
      } else if (file instanceof Blob) {
        fileToUpload = file;
      } else if (file.originFileObj) {
        fileToUpload = file.originFileObj;
      } else if (file.url) {
        setPreviewImage(file.url);
        return;
      } else {
        console.warn(`Unsupported file type: ${file.name}`);
        message.warning(
          `Unable to process ${file.name}. Please try a different file.`
        );
        return;
      }

      if (fileToUpload) {
        const { imageUrl } = await uploadImage(fileToUpload);
        setPreviewImage(imageUrl);
        console.log(fileToUpload, imageUrl);
      } else {
        message.error(`Can't handle ${file.name}.`);
      }
    },
    [],
  );

  return (
    <Card style={{ width: 640 }}>
      <Formik
        initialValues={initialValues || emptyBannerValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          // Handle form submission logic
          setSubmitting(true);
          console.log(values)
          setSubmitting(false);
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
          isValid,
        }) => (
          <Form onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="label"
              validateStatus={errors.label && touched.label ? 'error' : ''}
              help={errors.label && touched.label ? errors.label : ''}
            >
              <Input
                name="label"
                placeholder="Label"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.label}
                defaultValue={values.label}
              />
            </Form.Item>

            <Form.Item
              label="Banner Title"
              name="title"
              validateStatus={errors.title && touched.title ? 'error' : ''}
              help={errors.title && touched.title ? errors.title : ''}
            >
              <Input
                name="title"
                placeholder="Title"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
              />
            </Form.Item>

            <Form.Item
              name="subtitle"
              validateStatus={
                errors.subtitle && touched.subtitle ? 'error' : ''
              }
              help={errors.subtitle && touched.subtitle ? errors.subtitle : ''}
            >
              <Input
                name="subtitle"
                placeholder="Subtitle"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.subtitle}
              />
            </Form.Item>

            <Form.Item
              name="alignment"
              label="Alignment"
            >
              <Radio.Group
                name="alignment"
                value={values.alignment}
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={values.alignment}
              >
                {Object.values(BannerAlignment).map((alignment) => (
                  <Radio.Button
                    key={alignment}
                    name="alignment"
                    value={alignment}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {alignment.toString()}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="link"
              label="URL"
              validateStatus={
                errors.link && touched.link ? 'error' : ''
              }
              help={errors.link && touched.link ? errors.link : ''}
            >
              <Input
                name="link"
                placeholder="page url"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.link}
                defaultValue={values.link}
              />
            </Form.Item>

            <Form.Item
              name="button"
              validateStatus={
                errors.button && touched.button ? 'error' : ''
              }
              help={errors.button && touched.button ? errors.button : ''}
            >
              <Input
                name="button"
                placeholder="Button Text"
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={values.button}
                value={values.button}
              />
            </Form.Item>

            <Form.Item valuePropName="fileList" getValueFromEvent={null}>
              <Upload
                onChange={onBackgroundImageUpload}
                listType="picture-card"
                showUploadList={false}
                maxCount={1}
              >
                {previewImage ? (
                  <img src={previewImage} alt="Background Image" style={{ width: '100%' }} />
                ) : (
                  <Button
                    style={{
                      color: 'inherit',
                      cursor: 'inherit',
                      border: 0,
                      background: 'none',
                    }}
                  >
                    <PlusOutlined /> Image
                  </Button>
                )}
              </Upload>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
                <Button htmlType="button" onClick={onCancel}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </Card>
  );
}

export default EditBannerPage;
