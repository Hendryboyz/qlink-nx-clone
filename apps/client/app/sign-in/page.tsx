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
import { phoneRegex } from '@org/common';
import InputField from '$/components/Fields/InputField';

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
            console.log(values.phone);
            if (!values.phone) {
              errors.phone = 'Required';
            } else if (!phoneRegex.test(values.phone)) {
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
                  <InputField
                    type="text"
                    name="phone"
                    placeholder="Mobile Number"
                    headIconSource="assets/user2.svg"
                    autoComplete={true}
                    customClassName="border-white"
                  />
                  <ErrorMessage
                    name="phone"
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
