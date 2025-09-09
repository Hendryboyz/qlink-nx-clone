'use client';

import { ErrorMessage, Formik, FormikErrors } from 'formik';
import Container from './Container';
import API from '$/utils/fetch';
import { IdentifierType, OtpTypeEnum, StartOtpReqDto } from '@org/types';
import { CODE_SUCCESS, emailRegex } from '@org/common';
import { usePayload } from '$/store/payload';
import { Fragment } from 'react';
import SubmitButton from '$/components/Button/SubmitButton';
import { NOOP } from '$/utils';
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
  const initValue: FormData = { email: '', recaptchaToken: '' };
  const { setEmail, setOtpSessionId } = usePayload();
  return (
    <Container title="Forgot password?">
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
          setSubmitting(true);
          const email = String(values.email);
          const payload: StartOtpReqDto = {
            identifier: email,
            identifierType: IdentifierType.EMAIL,
            type: OtpTypeEnum.RESET_PASSWORD,
            recaptchaToken: values.recaptchaToken,
          };
          API.post('/v2/auth/otp', payload)
            .then((res) => {
              const {bizCode, data} = res;
              if (bizCode === CODE_SUCCESS) {
                setEmail(email);
                setOtpSessionId(data.sessionId);
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
              <form>
                <h4 className="text-[#FFF0D3] text-xl">
                  Enter Email Address
                </h4>
                <div className="mt-7">
                  <div id="email-input-container">
                    <InputField
                      type="email"
                      name="email"
                      placeholder="Email"
                      headIconSource="assets/mail.svg"
                      customClassName="border-white"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    className="text-[#E19500] absolute pl-11 text-sm font-gilroy-medium"
                    component="span"
                  />
                </div>
                <div className="mt-9">
                  <Recaptcha
                    recaptchaToken={values.recaptchaToken}
                    recaptchaError={errors.recaptchaToken}
                    setFieldValue={setFieldValue}
                    targetElementId="email-input-container"
                  />
                </div>
              </form>
            </div>
            <div className="mt-auto font-gilroy-medium">
              <div className="flex justify-end items-center mt-[2.75rem]">
                <SubmitButton
                  buttonColor="beige"
                  text="Send"
                  isLoading={isSubmitting}
                  onClick={() => (isValid ? handleSubmit() : NOOP())}
                />
              </div>
            </div>
          </Fragment>
        )}
      </Formik>
    </Container>
  );
};

export default Step1;
