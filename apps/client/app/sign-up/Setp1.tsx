import { Fragment } from 'react';
import Container from './Container';
import { Formik, FormikErrors, ErrorMessage, Form } from 'formik';
import Link from 'next/link';
import API from '$/utils/fetch';
import { IdentifierType, OtpTypeEnum } from 'types/src';
import { CODE_SUCCESS, emailRegex } from 'common/src';
import { usePayload } from './PayloadContext';
import SubmitButton from '$/components/Button/SubmitButton';
import Recaptcha from '$/components/Fields/Recaptcha';
import InputField from '$/components/Fields/InputField';

interface FormData {
  email: string;
  recaptchaToken: string;
}
type Props = {
  onSuccess: () => void;
};

const Step1 = (props: Props) => {
  const { setEmail } = usePayload()
  const initValue: FormData = { email: '', recaptchaToken: '' };
  return (
    <Container title="Create an account" step={1}>
      <Formik
        initialValues={initValue}
        validate={(values) => {
          const errors: FormikErrors<FormData> = {};
          if (!values.email) {
            errors.email = 'Required';
          } else if (!emailRegex.test(values.email)) {
            errors.email = 'Invalid email format';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          const email = String(values.email);
          const recaptchaToken = String(values.recaptchaToken);
          if (!recaptchaToken) {
            setSubmitting(false);
            setFieldError('recaptchaToken', 'Miss recaptcha validation');
            return;
          }
          setSubmitting(true);
          API.post('/v2/auth/otp', {
            identifier: email,
            identifierType: IdentifierType.EMAIL,
            recaptchaToken,
            type: OtpTypeEnum.REGISTER,
          })
            .then((res) => {
              if (res.bizCode == CODE_SUCCESS) {
                setEmail(email);
                props.onSuccess();
              } else {
                setFieldError('email', res.message);
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
            <div className="font-gilroy-medium">
              <h4 className="text-primary text-xl">
                Mobile Verification
              </h4>
              <Form id="signupForm">
                <div className="mt-9">
                  <InputField
                    type="email"
                    name="email"
                    placeholder="Email"
                    headIconSource="assets/mail.svg"
                    customClassName="border-[#FFCFA3]"
                  />
                  <ErrorMessage
                    name="email"
                    className="text-red-500 absolute"
                    component="span"
                  />
                </div>
                <div className="mt-9">
                  <Recaptcha
                    recaptchaToken={values.recaptchaToken}
                    recaptchaError={errors.recaptchaToken}
                    setFieldValue={setFieldValue}
                  />
                </div>
              </Form>
            </div>
            <div className="mt-auto font-gilroy-medium">
              <div className="flex justify-end text-red-500 items-center mt-12">
                <SubmitButton
                  text="Next"
                  isLoading={isSubmitting}
                  onClick={() => {
                    if (isValid) handleSubmit();
                  }}
                />
              </div>
              <p className="text-[#DF6B00] text-center mt-12">
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
