'use client';

import { Formik, FormikErrors, Field, ErrorMessage } from 'formik';
import Container from './Container';
import API from '$/utils/fetch';
import { OtpTypeEnum, SendOtpDto } from '@org/types';
import { CODE_SUCCESS, clientPhoneRegex } from '@org/common';
import { usePayload } from './PayloadContext';
import { Fragment } from 'react';
import SubmitButton from '$/components/Button/SubmitButton';
import { NOOP } from '$/utils';
import Recaptcha from '$/components/Fields/Recaptcha';
import InputField from '$/components/Fields/InputField';
interface FormData {
  phone: string;
  recaptchaToken: string;
}
type Props = {
  onSuccess: () => void;
};
const Step1 = (props: Props) => {
  const initValue: FormData = { phone: '', recaptchaToken: '' };
  const { setPhone } = usePayload();
  return (
    <Container title="Forgot password?">
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
          setSubmitting(true);
          const phone = String(values.phone);
          const payload: SendOtpDto = {
            phone,
            type: OtpTypeEnum.RESET_PASSWORD,
            recaptchaToken: values.recaptchaToken,
          };
          API.post('/auth/otp/send', payload)
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
            <div className="mt-auto font-gilroy-medium">
              <form>
                <h4 className="text-[#FFF0D3] text-xl">
                  Mobile Verification
                </h4>
                <div className="mt-9">
                  <InputField
                    type="tel"
                    name="phone"
                    placeholder="Mobile Number"
                    headIconSource="assets/phone2.svg"
                    customClassName="border-white"
                  />
                  <ErrorMessage
                    name="phone"
                    className="text-[#E19500] absolute"
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
              </form>
            </div>
            <div className="flex justify-end items-center mt-auto">
              <SubmitButton
                buttonColor="beige"
                text="Send"
                isLoading={isSubmitting}
                onClick={() => (isValid ? handleSubmit() : NOOP())}
              />
            </div>
          </Fragment>
        )}
      </Formik>
    </Container>
  );
};

export default Step1;
