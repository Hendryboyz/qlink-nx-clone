import { Fragment } from 'react';
import Container from './Container';
import { Formik, FormikErrors, Field, ErrorMessage, Form } from 'formik';
import Link from 'next/link';
import API from '$/utils/fetch';
import { OtpTypeEnum } from 'types/src';
import { clientPhoneRegex, CODE_SUCCESS } from 'common/src';
import { usePayload } from './PayloadContext';
import SubmitButton from '$/components/Button/SubmitButton';
import Recaptcha from '$/components/Fields/Recaptcha';

interface FormData {
  phone: string;
  recaptchaToken: string;
}
type Props = {
  onSuccess: () => void;
};

const Step1 = (props: Props) => {
  const { setPhone } = usePayload()
  const initValue: FormData = { phone: '', recaptchaToken: '' };
  return (
    <Container title="Create an account" step={1}>
      <Formik
        initialValues={initValue}
        validate={(values) => {
          const errors: FormikErrors<FormData> = {};
          if (!values.phone) {
            errors.phone = 'Required';
          } else if (!clientPhoneRegex.test(values.phone)) {
            errors.phone = 'Invalid phone number';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          const phone = String(values.phone);
          const recaptchaToken = String(values.recaptchaToken);
          if (!recaptchaToken) {
            setSubmitting(false);
            setFieldError('recaptchaToken', 'Miss recaptcha validation');
            return;
          }
          setSubmitting(true);
          API.post('/auth/otp/send', {
            phone,
            recaptchaToken,
            type: OtpTypeEnum.REGISTER,
          })
            .then((res) => {
              if (res.bizCode == CODE_SUCCESS) {
                setPhone(phone);
                props.onSuccess();
              } else {
                setFieldError('phone', res.message);
              }
            })
            .finally(() => setSubmitting(false));
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
          isValid,
          setFieldValue,
        }) => (
          <Fragment>
            <div>
              <h4 className="text-primary text-xl mt-20">
                Mobile Verification
              </h4>
              <Form id="signupForm">
                <div className="mt-6">
                  <label htmlFor="phone">
                    <div className="flex items-center bg-white border-white p-4 rounded-xl border-2 w-full">
                      <img src="assets/phone.svg" alt="phone" />
                      <Field
                        id="phone"
                        name="phone"
                        placeholder="Mobile Number"
                        type="tel"
                        className="flex-grow ml-2 text-lg"
                      />
                    </div>
                  </label>
                  <ErrorMessage
                    name="phone"
                    className="text-red-500"
                    component="span"
                  />
                </div>
                <div className="mt-6">
                  <Recaptcha
                    recaptchaToken={values.recaptchaToken}
                    recaptchaError={errors.recaptchaToken}
                    setFieldValue={setFieldValue}
                  />
                </div>
              </Form>
            </div>
            <div className="mt-auto">
              <div className="flex justify-end text-red-500 items-center mb-11">
                <SubmitButton
                  text="Next"
                  isLoading={isSubmitting}
                  onClick={() => {
                    if (isValid) handleSubmit();
                  }}
                />
              </div>
              <p className="text-[#DF6B00] text-center">
                Already a member?&nbsp;
                <Link href="/sign-in">
                  <span className="hover:underline">Log in</span>
                </Link>
              </p>
            </div>
          </Fragment>
        )}
      </Formik>
    </Container>
  );
};

export default Step1;
