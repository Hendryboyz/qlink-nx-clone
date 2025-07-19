'use client';

import React, { Fragment } from 'react';
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
import { emailRegex } from '@org/common';
import InputField from '$/components/Fields/InputField';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SignIn() {
  const initValue: FormData = { email: '', password: '', rememberMe: false };
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
            console.log(values.email);
            if (!values.email) {
              errors.email = 'Required';
            } else if (!emailRegex.test(values.email)) {
              errors.email = 'Invalid email format';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            API.post('auth/login', {
              email: String(values.email),
              password: values.password,
              remember_me: values.rememberMe,
            })
              .then((_) => {
                router.push('/');
              })
              .catch((err) => {
                console.error(err);
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
                  <InputField
                    type="text"
                    name="email"
                    placeholder="Email"
                    headIconSource="assets/user2.svg"
                    autoComplete={true}
                    customClassName="border-white"
                  />
                  <ErrorMessage
                    name="email"
                    className="text-[#E19500] absolute"
                    component="span"
                  />
                </div>
                <div>
                  <InputField
                    name="password"
                    type="password"
                    placeholder="Password"
                    headIconSource="assets/lock2.svg"
                    customClassName="border-white"
                  />
                  <ErrorMessage
                    name="password"
                    className="text-[#E19500] absolute"
                    component="span"
                  />
                </div>
                <div className="flex mt-5 justify-between items-center text-xs font-gilroy-medium">
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center pl-1 cursor-pointer"
                  >
                    <Field name="rememberMe">
                      {({ field }) => (
                        <div className="relative">
                          <input
                            id="rememberMe"
                            type="checkbox"
                            checked={values.rememberMe}
                            onChange={() => {
                              setFieldValue('rememberMe', !values.rememberMe);
                            }}
                            className="sr-only"
                          />
                          <div
                            className={`
                              w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center transition-all duration-200
                              ${values.rememberMe
                                ? 'bg-primary border-primary'
                                : 'bg-transparent border-white'
                              }
                            `}
                          >
                            {values.rememberMe && (
                              <img
                                src="/assets/checked.svg"
                                alt="checked"
                                className="w-2.5 h-1.5"
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </Field>
                    <span className="ml-2 text-white leading-5">
                      Remember Me
                    </span>
                  </label>
                  <Link href="/reset-password" className="leading-5">
                    <span className="text-red-300 text-right">
                      Forgot password?
                    </span>
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
