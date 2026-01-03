import { type FC, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';

import Recaptcha from '$/components/Fields/Recaptcha';
import { Field, FieldProps, Formik, FormikErrors } from 'formik';
import { CODE_SUCCESS, emailRegex } from '@org/common';
import API from '$/utils/fetch';
import { IdentifierType, OtpTypeEnum, StartOtpReqDto } from '@org/types';
import { TGButton, TGInput } from '@org/components';
import AgreeTerm from '../sign-in/agree-term';

interface FormData {
  email: string;
  recaptchaToken: string;
  agreed: boolean;
}

type SignUpStep1Props = {
  onSuccess: (data: { email: string; sessionId: string }) => void;
};

export const SignUpStep1Title = () => {
  return (
    <div className="flex flex-col ml-1">
      <span className="text-base text-red-600 font-bold">Step 1</span>
      <h4 className="text-2xl font-bold text-text-str">Create a new account</h4>
    </div>
  );
};

const SignUpStep1: FC<SignUpStep1Props> = ({ onSuccess }) => {
  const initValue: FormData = { email: '', recaptchaToken: '', agreed: false };

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <>
      <Formik
        initialValues={initValue}
        validate={(values) => {
          const errors: FormikErrors<FormData> = {};
          if (!values.email) {
            errors.email = 'Required';
          } else if (!emailRegex.test(values.email)) {
            errors.email = 'Invalid email format';
          }
          if (!values.agreed) {
            errors.agreed = 'You must agree to the terms';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          setSubmitting(true);
          const email = String(values.email);
          const payload: StartOtpReqDto = {
            identifier: email,
            identifierType: IdentifierType.EMAIL,
            type: OtpTypeEnum.REGISTER,
            recaptchaToken: values.recaptchaToken,
          };
          API.post('/v2/auth/otp', payload)
            .then((res) => {
              const { bizCode, data } = res;
              if (bizCode === CODE_SUCCESS) {
                onSuccess({
                  email,
                  sessionId: data.sessionId,
                });
              } else {
                setFieldError('email', res.message);
              }
            })
            .finally(() => {
              setSubmitting(false);
              recaptchaRef.current?.reset();
            });
        }}
      >
        {({ values, errors, isSubmitting, setFieldValue, handleSubmit }) => (
          <form
            className="flex flex-col flex-1 h-full mt-6"
            onSubmit={handleSubmit}
          >
            <div className="flex-grow">
              <div className="mb-6" id="email-input-container">
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
                      error={
                        meta.touched && meta.error ? meta.error : undefined
                      }
                    />
                  )}
                </Field>
              </div>
              <div className="mb-6">
                <Recaptcha
                  ref={recaptchaRef}
                  recaptchaToken={values.recaptchaToken}
                  recaptchaError={errors.recaptchaToken}
                  setFieldValue={(val) => setFieldValue('recaptchaToken', val)}
                  targetElementId="email-input-container"
                />
              </div>

              <div className="mt-4">
                <Link
                  href="/login"
                  className="text-red-600 text-sm font-medium hover:underline"
                >
                  Already a member? Log in
                </Link>
              </div>
            </div>

            <div className="mt-auto">
              <AgreeTerm
                onChange={(checked) => setFieldValue('agreed', checked)}
                checked={values.agreed}
              />
              <TGButton
                type="submit"
                disabled={
                  isSubmitting ||
                  !values.agreed ||
                  !values.email ||
                  !values.recaptchaToken
                }
                fullWidth
                size="xl"
                variant="primary"
              >
                Next
              </TGButton>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default SignUpStep1;
