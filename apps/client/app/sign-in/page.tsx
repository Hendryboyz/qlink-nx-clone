'use client';

import { Formik, FormikErrors, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import Title from '../../components/Title';
import GradientBackground from '../../../client/components/GradientBackground';
import { Fragment } from 'react';
import API from '$/utils/fetch';
import SubmitButton from '$/components/Button/SubmitButton';
import { NOOP } from '$/utils';
import { useRouter } from 'next/navigation';
import { usePopup } from '$/hooks/PopupProvider';

interface FormData {
  phone: string;
  password: string;
  rememberMe: boolean;
}

export default function SignIn() {
  const initValue: FormData = { phone: '', password: '', rememberMe: false };
  const router = useRouter();
  const { showPopup } = usePopup();
  return (
    <GradientBackground>
      <div className="w-full py-16 pb-10 px-12 flex flex-col h-full flex-1 ">
        <Title className="mb-12 text-left w-10 text-primary">
          Welcome Back!
        </Title>
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
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            API.post('auth/login', {
              phone: String(values.phone),
              password: values.password,
              remember_me: values.rememberMe,
            })
              .then((_) => {
                router.push('/home');
              })
              .catch((err) => {
                console.log(err);
                showPopup({ title: 'Incorrect Credentials'});
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
            setFieldValue,
            isValid,
          }) => (
            <Fragment>
              <div className="space-y-8 p-2">
                <label htmlFor="phone" className="block">
                  <div className="flex items-center bg-white border-white p-4 rounded-xl border-2 w-full">
                    <img src="assets/user.svg" alt="phone" />
                    <Field
                      id="phone"
                      name="phone"
                      placeholder="Mobile Number"
                      type="number"
                      className="flex-grow ml-2"
                      autoComplete="on"
                    />
                  </div>
                </label>
                <ErrorMessage
                  name="phone"
                  className="text-red-500"
                  component="span"
                />
                <div>
                  <label htmlFor="password" className="block">
                    <div className="flex items-center bg-white border-white p-4 rounded-xl border-2 w-full">
                      <img src="assets/lock.svg" alt="password" />
                      <Field
                        id="password"
                        name="password"
                        placeholder="Password"
                        type="password"
                        className="flex-grow ml-2"
                      />
                    </div>
                  </label>
                  <ErrorMessage
                    name="password"
                    className="text-red-500"
                    component="span"
                  />
                  <div className="flex justify-between items-center">
                    <label htmlFor="rememberMe" className='flex items-center pl-1'>
                      <Field
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        className=""
                        onChange={() => {
                          setFieldValue('rememberMe', !values.rememberMe);
                        }}
                      />
                      <span className='text-xs ml-2 mt-0.5'>Keep me signed in</span>
                    </label>
                    <Link href="/reset-password">
                      <h4 className="mt-2 text-gray-500 text-right">
                        Forgot password?
                      </h4>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xl text-white">Sign In</span>
                <SubmitButton
                  onClick={() => (isValid ? handleSubmit() : NOOP())}
                  isLoading={isSubmitting}
                />
              </div>
            </Fragment>
          )}
        </Formik>
        <Link href="/sign-up" className="text-center mt-8 text-gray-500">
          <h4>Don&apos;t have account? Sign up</h4>
        </Link>
      </div>
    </GradientBackground>
  );
}
