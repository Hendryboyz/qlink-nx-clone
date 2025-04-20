'use client';

import { Formik, FormikErrors, Field, ErrorMessage } from 'formik';
import Container from './Container';
import Button from '../../components/Button';
import * as Yup from 'yup';
import { Fragment, useState } from 'react';
import API from '$/utils/fetch';
import { ResetPasswordDto } from '@org/types';
import { CODE_SUCCESS, HEADER_PRE_TOKEN } from '@org/common';
import { useRouter } from 'next/navigation';
import { usePayload } from './PayloadContext';
import { NOOP } from '$/utils';

const FormSchema = Yup.object().shape({
  password: Yup.string().max(50, 'Too Long').required('Required'),
  rePassword: Yup.string().max(50, 'Too Long').required('Required'),
});

interface FormData {
  password: string;
  rePassword: string;
}
const DEFAULT_INPUT_STYLES =
  'flex items-center justify-between bg-white border-white p-4 rounded-xl border-2 w-full';

const Step3 = () => {
  const initValue: FormData = { password: '', rePassword: '' };
  const router = useRouter();
  const { token } = usePayload();
  const [showPassword, togglePassword] = useState(false);
  const [showRePassword, toggleRePassword] = useState(false);

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
          API
            .post('/auth/reset-password', payload, {
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
          isValid
        }) => (
          <Fragment>
            <div className="mt-auto">
              <form>
                <label htmlFor="password">
                  <div className={`${DEFAULT_INPUT_STYLES} mb-6 relative`}>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                    />
                    <img
                      src="assets/eye.svg"
                      alt="hidden"
                      onClick={() => togglePassword((pre) => !pre)}
                    />
                    <ErrorMessage
                      name="password"
                      className="text-red-500 absolute top-full w-full left-0"
                      component="span"
                    />
                  </div>
                </label>
                <label htmlFor="rePassword">
                  <div className={`${DEFAULT_INPUT_STYLES}`}>
                    <Field
                      id="rePassword"
                      name="rePassword"
                      type={showRePassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                    />
                    <img
                      src="assets/eye.svg"
                      alt="hidden"
                      onClick={() => toggleRePassword((pre) => !pre)}
                    />
                  </div>
                </label>
                <ErrorMessage
                  name="rePassword"
                  className="text-red-500"
                  component="span"
                />
              </form>
            </div>
            <div className="flex justify-end items-center mt-auto">
              <Button
                theme="light"
                className="uppercase"
                style={{ width: '85px' }}
                isLoading={isSubmitting}
                onClick={() => isValid ? handleSubmit() : NOOP()}
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
