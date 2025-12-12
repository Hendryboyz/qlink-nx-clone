import { Formik } from 'formik';
import { Button, Form, Input, DatePicker, Space, Card } from 'antd';
import * as Yup from 'yup';

type EditBannerProps = {
  // * null banner to add a new banner
  // * defined banner to update banner
  banner: any;
  onCancel: () => void;
};

function EditBannerPage({ banner, onCancel }: EditBannerProps) {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Please enter ad title'),
    content: Yup.string().required('Please enter ad content'),
    startDate: Yup.date().required('Please select start date'),
    endDate: Yup.date().required('Please select end date'),
  });

  return (
    <Card style={{ width: 640 }}>
      <Formik
        initialValues={{
          label: '',
          title: '',
          subtitle: '',
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
          <Form onFinish={handleSubmit} layout='vertical'>
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
              validateStatus={errors.subtitle && touched.subtitle ? 'error' : ''}
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


            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
                <Button
                  htmlType="button"
                  onClick={onCancel}
                >
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
