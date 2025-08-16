'use client';

import { Formik, ErrorMessage } from 'formik';
import Container from './Container';
import Button from '../../components/Button';
import * as Yup from 'yup';
import React, { Fragment } from 'react';
import API from '$/utils/fetch';
import { ResetPasswordDto } from '@org/types';
import { CODE_SUCCESS, HEADER_PRE_TOKEN } from '@org/common';
import { useRouter } from 'next/navigation';
import { usePayload } from '$/store/payload';
import { NOOP } from '$/utils';
import InputField from '$/components/Fields/InputField';

const FormSchema = Yup.object().shape({
  password: Yup.string().max(50, 'Too Long').required('Required'),
  rePassword: Yup.string().max(50, 'Too Long').required('Required'),
});

interface FormData {
  password: string;
  rePassword: string;
}
const Step3 = () => {
  const initValue: FormData = { password: '', rePassword: '' };
  const router = useRouter();
  const { token } = usePayload();

  return (
    <Container title="Set new password">
      <Formik
        initialValues={initValue}
        validationSchema={FormSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          const payload: ResetPasswordDto = {
            password: values.password,
            rePassword: values.rePassword,
          };
          setSubmitting(true);
          API.post('/auth/reset-password', payload, {
            headers: {
              [HEADER_PRE_TOKEN]: token,
            },
          })
            .then((res) => {
              if (res.bizCode == CODE_SUCCESS) {
                // show success
                router.push('/');
              } else {
                console.log(res.data?.error?.message);
                setFieldError('password', res.data?.error?.message);
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
        }) => (
          <Fragment>
            <div className="font-gilroy-medium">
              <form>
                <h4 className="text-[#FFF0D3] text-xl opacity-0">
                  Set New Password
                </h4>
                <div className="mt-7">
                  <div>
                    <InputField
                      name="password"
                      type="password"
                      placeholder="New Password"
                      customClassName="border-white pr-5"
                    />
                    <div className="min-h-8">
                      <ErrorMessage name="password">
                        {(msg) => <span className="text-[#E19500] pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div>
                    <InputField
                      name="rePassword"
                      type="password"
                      placeholder="Confirm New Password"
                      customClassName="border-white pr-5"
                    />
                    <div className="min-h-8">
                      <ErrorMessage name="rePassword">
                        {(msg) => <span className="text-[#E19500] pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex justify-end items-center mt-[42px]">
              <Button
                theme="light"
                className="uppercase font-gilroy-medium"
                style={{ width: '80px', height: '40px', borderRadius: '20px' }}
                isLoading={isSubmitting}
                onClick={() => (isValid ? handleSubmit() : NOOP())}
              >
                Save
              </Button>
            </div>
          </Fragment>
        )}
      </Formik>
    </Container>
  );
};

export default Step3;
