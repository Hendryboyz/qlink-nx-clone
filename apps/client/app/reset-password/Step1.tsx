'use client';

import { Formik, FormikErrors, Field, ErrorMessage } from 'formik';
import Container from './Container';
import API from '$/utils/fetch';
import { OtpTypeEnum, SendOtpDto } from '@org/types/src';
import { CODE_SUCCESS } from '@org/common/src';
import { usePayload } from './PayloadContext';
import { Fragment } from 'react';
import SubmitButton from '$/components/Button/SubmitButton';
import { NOOP } from '$/utils';
interface FormData {
  phone: string;
}
type Props = {
  onSuccess: () => void;
};
const Step1 = (props: Props) => {
  const initValue: FormData = { phone: '' };
  const { setPhone } = usePayload();
  return (
    <Container title="Forgot password?">
      <Formik
        initialValues={initValue}
        validate={(values) => {
          const errors: FormikErrors<FormData> = {};
          if (!values.phone) {
            errors.phone = 'Required';
          } else if (!/^[0-9]{12}$/.test(values.phone)) {
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
          };
          API
            .post('/auth/otp/send', payload)
            .then((res) => {
              if (res.bizCode == CODE_SUCCESS) {
                setPhone(phone);
                props.onSuccess();
              } else {
                setFieldError('phone', res.data?.error?.message);
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
          isValid
        }) => (
          <Fragment>
            <div className="mt-auto">
              <form>
                <h4 className="text-primary text-xl mb-6">
                  Mobile Verification
                </h4>
                <label htmlFor="phone" className="block">
                  <div className="flex items-center bg-white border-white p-4 rounded-xl border-2 w-full">
                    <img src="assets/phone.svg" alt="phone" />
                    <Field
                      id="phone"
                      name="phone"
                      placeholder="Mobile Number"
                      type="number"
                      className="flex-grow ml-2"
                    />
                  </div>
                </label>
                <ErrorMessage
                  name="phone"
                  className="text-red-500"
                  component="span"
                />
              </form>
            </div>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-xl text-white">Send</span>
              <SubmitButton
                isLoading={isSubmitting}
                onClick={() => isValid ? handleSubmit() : NOOP()}
              />
            </div>
          </Fragment>
        )}
      </Formik>
    </Container>
  );
};

export default Step1;
