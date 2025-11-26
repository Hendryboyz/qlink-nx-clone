import { Formik } from 'formik';
import { Button, Form, Input, DatePicker } from 'antd';
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

  return (<Formik
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
  </Formik>);
}

export default EditBannerPage;
