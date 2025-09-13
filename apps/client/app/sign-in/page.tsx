'use client';

import React, { Fragment } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, FormikErrors, Field, ErrorMessage, FieldProps } from 'formik';
import {signIn} from "next-auth/react";

import Banner from '$/components/Banner';
import { ColorBackground } from '$/components/Background';
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
  const searchParams = useSearchParams();
  const signInCallback = searchParams.get('callbackUrl');
  const initValue: FormData = { email: '', password: '', rememberMe: false };
  const router = useRouter();
  const { showPopup } = usePopup();

  function onClose() {
    router.push('/')
  }

  return (
    <ColorBackground color="#D70127">
      <div className="w-full py-32 px-12 flex flex-col min-h-screen">
        <div className="absolute top-[24px] right-[24px]" onClick={onClose}>
          <Cross2Icon
            height={24}
            width={24}
            color="white"
            className="justify-self-end cursor-pointer"
          />
        </div>
        <div className="flex flex-col w-full">
          <Banner />
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
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            signIn("credentials", {
              redirect: false,
              email: values.email,
              password: values.password,
              rememberMe: values.rememberMe,
              callbackUrl: signInCallback ? signInCallback : '/',
            }).then((res) => {
              if (res && res.ok) {
                console.log(res);
                router.push(signInCallback ? signInCallback : '/');
                return;
              }
              console.error(res);
              showPopup({ title: 'Incorrect Credentials' });
            }).finally(() => setSubmitting(false));;
            // API.post('auth/login', {
            //   email: String(values.email),
            //   password: values.password,
            //   rememberMe: values.rememberMe,
            // })
            //   .then((_) => {
            //     router.push('/');
            //   })
            //   .catch((err) => {
            //     console.error(err);
            //     showPopup({ title: 'Incorrect Credentials' });
            //   })
            //   .finally(() => setSubmitting(false));
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
              <div className="py-20">
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
                    className="text-[#E19500] absolute pl-10 text-sm font-gilroy-medium"
                    component="span"
                  />
                </div>
                <div className="mt-6">
                  <InputField
                    name="password"
                    type="password"
                    placeholder="Password"
                    headIconSource="assets/lock2.svg"
                    customClassName="border-white"
                  />
                  <ErrorMessage
                    name="password"
                    className="text-[#E19500] absolute pl-10 text-sm font-gilroy-medium"
                    component="span"
                  />
                </div>
                <div className="flex mt-7 justify-between items-center text-xs font-gilroy-medium">
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center cursor-pointer pl-[13px]"
                  >
                    <Field name="rememberMe">
                      {({ field }: FieldProps) => (
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
                    <span className="ml-1 text-white text-xs font-gilroy-medium">
                      Remember Me
                    </span>
                  </label>
                  <Link href="/reset-password" className="pr-3">
                    <span className="text-red-300 text-xs font-gilroy-medium">
                      Forgot password?
                    </span>
                  </Link>
                </div>
                <div className="flex justify-end items-center mt-8">
                  <SubmitButton
                    buttonColor="beige"
                    text="Sign In"
                    onClick={() => (isValid ? handleSubmit() : NOOP())}
                    isLoading={isSubmitting}
                  />
                </div>
              </div>

            </Fragment>
          )}
          </Formik>
          <Link href="/sign-up" className="text-center text-sm text-red-300 -mt-12 font-gilroy-medium">
            <h4>Don&apos;t have account? Sign up</h4>
          </Link>
        </div>
      </div>
    </ColorBackground>
  );
}
