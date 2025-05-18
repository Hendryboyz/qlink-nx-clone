'use client';

import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, FormikErrors, Field, ErrorMessage } from 'formik';
import Banner from '$/components/Banner';
import { ColorBackground } from '$/components/Background';
import API from '$/utils/fetch';
import SubmitButton from '$/components/Button/SubmitButton';
import { NOOP } from '$/utils';
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
    <ColorBackground color="#D70127">
      <div className="w-full py-16 pb-10 px-12 flex flex-col h-full flex-1 ">
        <Banner className="self-center" />
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
                router.push('/');
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
                      className="flex-grow ml-2 text-lg"
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
                        className="flex-grow ml-2 text-lg"
                      />
                    </div>
                  </label>
                  <ErrorMessage
                    name="password"
                    className="text-red-500"
                    component="span"
                  />
                  <div className="flex mt-5 justify-between items-center text-xs">
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
                      <span className='ml-2 mt-0.5 text-white'>Keep me signed in</span>
                    </label>
                    <Link href="/reset-password">
                      <h4 className="text-red-300 text-right">
                        Forgot password?
                      </h4>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center mt-auto">
                <SubmitButton
                  buttonColor="beige"
                  text="Sign In"
                  onClick={() => (isValid ? handleSubmit() : NOOP())}
                  isLoading={isSubmitting}
                />
              </div>
            </Fragment>
          )}
        </Formik>
        <Link href="/sign-up" className="text-center text-sm mt-8 text-red-300">
          <h4>Don&apos;t have account? Sign up</h4>
        </Link>
      </div>
    </ColorBackground>
  );
}
