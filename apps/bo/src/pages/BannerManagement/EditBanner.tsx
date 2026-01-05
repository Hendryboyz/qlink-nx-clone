import { Formik } from 'formik';
import { Button, Form, Input, Space, Card, Radio, Upload, message } from 'antd';
import * as Yup from 'yup';
import { PlusOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useCallback, useEffect, useState } from 'react';
import { BannerEntity } from '@org/types';

type EditBannerProps = {
  // * null initialValues to add a new banner
  // * defined initialValues to update banner
  initialValues?: BannerEntity;
  onCancel: () => void;
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Please enter ad title'),
  content: Yup.string().required('Please enter ad content'),
  startDate: Yup.date().required('Please select start date'),
  endDate: Yup.date().required('Please select end date'),
});

function EditBannerPage({ initialValues, onCancel }: EditBannerProps) {
  const [previewImage, setPreviewImage] = useState<string>(initialValues?.image || null);

  useEffect(() => {
    if (initialValues) {

    }
  }, []);

  const onBackgroundImageUpload = useCallback(
    (info: UploadChangeParam<UploadFile<File>>)=> {
      const { file } = info;
      let fileToUpload: File | Blob | undefined;

      if (file instanceof File) {
        fileToUpload = file;
      } else if (file instanceof Blob) {
        fileToUpload = file;
      } else if (file.originFileObj) {
        fileToUpload = file.originFileObj;
      } else if (file.url) {
        return;
      } else {
        console.warn(`Unsupported file type: ${file.name}`);
        message.warning(
          `Unable to process ${file.name}. Please try a different file.`
        );
        return;
      }

      if (fileToUpload) {
        // const { imageUrl } = await uploadImage(fileToUpload);
        console.log(fileToUpload);
      } else {
        message.error(`Can't handle ${file.name}.`);
      }
    },
    [],
  );

  return (
    <Card style={{ width: 640 }}>
      <Formik
        initialValues={{
          label: '',
          title: '',
          subtitle: '',
          buttonText: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          // Handle form submission logic
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

            <Form.Item name="alignment" label="Alignment">
              <Radio.Group>
                <Radio.Button value="top">Top</Radio.Button>
                <Radio.Button value="middle">Middle</Radio.Button>
                <Radio.Button value="bottom">Bottom</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="buttonText">
              <Input
                name="buttonText"
                placeholder="Button Text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.buttonText}
              />
            </Form.Item>

            <Form.Item valuePropName="fileList" getValueFromEvent={null}>
              <Upload
                onChange={onBackgroundImageUpload}
                listType="picture-card"
                showUploadList={false}
                maxCount={1}
              >
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
