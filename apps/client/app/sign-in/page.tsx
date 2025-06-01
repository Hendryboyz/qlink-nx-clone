'use client';

import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, FormikErrors, Field, ErrorMessage } from 'formik';
import Banner from '$/components/Banner';
import { ColorBackground } from '$/components/Background';
import API from '$/utils/fetch';
import SubmitButton from '$/components/Button/SubmitButton';
import { NOOP } from '$/utils';
import { usePopup } from '$/hooks/PopupProvider';
import { Cross2Icon } from '@radix-ui/react-icons';

interface FormData {
  phone: string;
  password: string;
  rememberMe: boolean;
}

export default function SignIn() {
  const initValue: FormData = { phone: '', password: '', rememberMe: false };
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { showPopup } = usePopup();

  function onClose() {
    router.push('/');
  }

  return (
    <ColorBackground color="#D70127">
      <div className="w-full py-16 pb-10 px-12 flex flex-col h-full flex-1 ">
        <div onClick={onClose}>
          <Cross2Icon
            height={24}
            width={24}
            color="white"
            className="justify-self-end cursor-pointer"
          />
        </div>
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
                showPopup({ title: 'Incorrect Credentials' });
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
              <div className="space-y-6 p-2">
                <div>
                  <label htmlFor="phone" className="block">
                    <div className="flex items-center bg-white border-white p-4 rounded-xl border-2 w-full">
                      <img src="assets/user2.svg" alt="phone" />
                      <Field
                        id="phone"
                        name="phone"
                        placeholder="Mobile Number"
                        type="text"
                        className="flex-grow ml-2 text-sm font-gilroy-medium"
                        autoComplete="on"
                      />
                    </div>
                  </label>
                  <ErrorMessage
                    name="phone"
                    className="text-[#E19500] absolute"
                    component="span"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block">
                    <div className="flex items-center bg-white border-white p-4 rounded-xl border-2 w-full">
                      <img src="assets/lock2.svg" alt="password" />
                      <Field
                        id="password"
                        name="password"
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        className="flex-grow ml-2 text-sm font-gilroy-medium"
                      />
                      <img
                        src="assets/eye.svg"
                        alt="phone"
                        onClick={() =>
                          setShowPassword((prevState) => !prevState)
                        }
                      />
                    </div>
                  </label>
                  <ErrorMessage
                    name="password"
                    className="text-[#E19500] absolute"
                    component="span"
                  />
                </div>
                <div className="flex mt-5 justify-between items-center text-xs font-gilroy-medium">
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center pl-1"
                  >
                    <Field
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      onChange={() => {
                        setFieldValue('rememberMe', !values.rememberMe);
                      }}
                    />
                    <span className="ml-2 mt-0.5 text-white">
                      Remember Me
                    </span>
                  </label>
                  <Link href="/reset-password">
                    <h4 className="text-red-300 text-right">
                      Forgot password?
                    </h4>
                  </Link>
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
