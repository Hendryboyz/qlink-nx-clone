import { type FC, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import Recaptcha from '$/components/Fields/Recaptcha';
import { Field, FieldProps, Formik, FormikErrors } from 'formik';
import { CODE_SUCCESS, emailRegex } from '@org/common';
import API from '$/utils/fetch';
import { IdentifierType, OtpTypeEnum, StartOtpReqDto } from '@org/types';
import { TGButton, TGInput } from '@org/components';

interface FormData {
  email: string;
  recaptchaToken: string;
}

type ResetPasswordStep1Props = {
  onSuccess: (data: { email: string; sessionId: string }) => void;
};

export const ResetPasswordStep1Title = () => {
  return (
    <h4 className="text-xl font-bold text-text-str ml-1">Verify your Email</h4>
  );
};

const ResetPasswordStep1: FC<ResetPasswordStep1Props> = ({ onSuccess }) => {
  const initValue: FormData = { email: '', recaptchaToken: '' };

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <>
      <div className="grid grid-cols-1 place-content-center">
        <div className="text-text-w text-sm font-manrope">
          We will send you a code via email to verify yourself. Please check
          your email after clicking the button below.
        </div>
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
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            setSubmitting(true);
            const email = String(values.email);
            const payload: StartOtpReqDto = {
              identifier: email,
              identifierType: IdentifierType.EMAIL,
              type: OtpTypeEnum.RESET_PASSWORD,
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
                  setFieldError('email', res.message); // TODO: show alert modal
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
                <Recaptcha
                  ref={recaptchaRef}
                  recaptchaToken={values.recaptchaToken}
                  recaptchaError={errors.recaptchaToken}
                  setFieldValue={setFieldValue}
                  targetElementId="email-input-container"
                />
              </div>
              <TGButton
                className="mt-6"
                type="submit"
                disabled={isSubmitting}
                fullWidth
                size="xl"
                variant="primary"
              >
                Email me a code
              </TGButton>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ResetPasswordStep1;
