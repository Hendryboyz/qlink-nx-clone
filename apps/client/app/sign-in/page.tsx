'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, FormikErrors, ErrorMessage, Field, FieldProps } from 'formik';
import { signIn } from 'next-auth/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { emailRegex } from '@org/common';
import { usePopup } from '$/hooks/PopupProvider';
import { TGButton, TGInput } from '@org/components';

interface FormData {
  email: string;
  password: string;
  agreedToTerms: boolean;
}

function SignInForm() {
  const initValue: FormData = { email: '', password: '', agreedToTerms: false };
  const searchParams = useSearchParams();
  const signInCallback = searchParams.get('callbackUrl') ?? '/';
  const { showPopup } = usePopup();

  return (
    <Formik
      initialValues={initValue}
      validate={(values) => {
        const errors: FormikErrors<FormData> = {};
        if (!values.email) {
          errors.email = 'Required';
        } else if (!emailRegex.test(values.email)) {
          errors.email = 'Invalid email format';
        }
        if (!values.password) {
          errors.password = 'Required';
        }
        if (!values.agreedToTerms) {
          errors.agreedToTerms = 'You must agree to the terms';
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        signIn('credentials', {
          redirect: false,
          email: values.email,
          password: values.password,
          callbackUrl: signInCallback,
        })
          .then((res) => {
            if (res && res.ok) {
              const callbackUrl = res.url ? res.url : '/';
              window.location.replace(`${callbackUrl}`);
              return;
            }
            console.error(res);
            showPopup({ title: 'Incorrect Credentials' });
          })
          .finally(() => setSubmitting(false));
      }}
    >
      {({
        values,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 h-full">
          <div className="flex-grow">
            {/* Email Field */}
            <div className="mb-6">
              <div className="block text-sm font-medium text-text-strong mb-2">
                <span>Email</span>
                <span className="font-bold ml-1">(*Required)</span>
              </div>
              <Field name="email">
                {({ field, meta }: FieldProps) => (
                  <TGInput
                    {...field}
                    type="text"
                    placeholder=""
                    className="text-text-str font-bold"
                    error={meta.touched && meta.error ? meta.error : undefined}
                  />
                )}
              </Field>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <div className="block text-sm font-medium text-text-strong mb-2">
                <span>Password</span>
                <span className="font-bold ml-1">(*Required)</span>
              </div>
              <Field name="password">
                {({ field, meta }: FieldProps) => (
                  <TGInput
                    {...field}
                    type="password"
                    placeholder=""
                    className="text-text-str font-bold"
                    error={meta.touched && meta.error ? meta.error : undefined}
                  />
                )}
              </Field>
            </div>

            {/* Forgot Password */}
            <div>
              <Link
                href="/reset-password"
                className="text-error text-sm font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto pb-8">
            {/* Terms Checkbox */}
            <div className="flex items-center mb-6">
              <div className="flex items-center h-5">
                <input
                  id="agreedToTerms"
                  name="agreedToTerms"
                  type="checkbox"
                  checked={values.agreedToTerms}
                  onChange={(e) =>
                    setFieldValue('agreedToTerms', e.target.checked)
                  }
                  className="w-5 h-5 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm text-text-str">
                <label htmlFor="agreedToTerms">
                  <span>{"I agree to the Qlink Rider Club's "}</span>
                  <Link href="/terms-of-service" className="text-primary underline font-bold">
                    Terms of Service
                  </Link>
                  <span>{` and `}</span>
                  <Link href="/privacy-policy" className="text-primary underline font-bold">
                    Privacy Policy
                  </Link>
                  <span>{'. The service is for Nigeria only.'}</span>
                </label>
                <ErrorMessage
                  name="agreedToTerms"
                  className="text-error text-xs mt-1 block"
                  component="div"
                />
              </div>
            </div>

            <TGButton
              type="submit"
              disabled={isSubmitting}
              fullWidth
              size="xl"
              variant="primary"
            >
              Continue
            </TGButton>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default function SignIn() {
  const router = useRouter();

  return (
    <div className="w-full h-screen bg-secondary flex flex-col px-6 pt-6">
      {/* Header */}
      <div className="flex items-center mb-6 flex-none">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeftIcon className="w-8 h-8 text-stroke-s" />
        </button>
        <h4 className="text-xl font-bold text-text-str ml-1">
          Log in to QLINK Rider Club
        </h4>
      </div>
      <SignInForm />
    </div>
  );
}
