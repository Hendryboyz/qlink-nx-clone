import { type FC } from 'react';
import { Field, FieldProps, Formik, FormikErrors } from 'formik';
import { CODE_SUCCESS, HEADER_PRE_TOKEN } from '@org/common';
import API from '$/utils/fetch';
import { ResetPasswordDto } from '@org/types';
import { TGButton, TGInput } from '@org/components';

type ResetPasswordStep3Props = {
  token: string;
  onSuccess: () => void;
};

export const ResetPasswordStep3Title = () => {
  return (
    <h4 className="text-xl font-bold text-text-str ml-1">
      Reset your password
    </h4>
  );
};

const ResetPasswordStep3: FC<ResetPasswordStep3Props> = ({
  token,
  onSuccess,
}) => {
  const initValue: ResetPasswordDto = { password: '', rePassword: '' };

  return (
    <>
      <div className="grid grid-cols-1 place-content-center">
        <div className="text-text-w text-sm font-manrope">
          Your password must have at least 8 characters, including one English
          letter (a-z), and one number (0-9).
        </div>
        <Formik
          initialValues={initValue}
          validate={(values) => {
            const errors: FormikErrors<ResetPasswordDto> = {};
            // Regex for at least 8 chars, 1 letter, 1 number
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

            if (!values.password) {
              errors.password = 'Required';
            } else if (!passwordRegex.test(values.password)) {
              errors.password =
                'Password must be at least 8 characters with 1 letter and 1 number';
            }

            if (!values.rePassword) {
              errors.rePassword = 'Required';
            } else if (values.password !== values.rePassword) {
              errors.rePassword = 'Passwords do not match';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            setSubmitting(true);

            API.post('/auth/reset-password', values, {
              headers: {
                [HEADER_PRE_TOKEN]: token,
              },
            })
              .then((res) => {
                const { bizCode } = res;
                if (bizCode === CODE_SUCCESS) {
                  onSuccess();
                } else {
                  // If the error is related to a specific field, we could set it.
                  // Otherwise, we might want to show a general error.
                  // For simplicity, we'll set a general error on the password field or alert.
                   console.error(res.message || 'Failed to reset password');
                }
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <form
              className="flex flex-col flex-1 h-full mt-6"
              onSubmit={handleSubmit}
            >
              <div className="flex-grow space-y-6">
                <div id="password-input-container">
                  <div className="block text-sm font-medium text-text-strong mb-2">
                    <span>New Password</span>
                    <span className="font-bold ml-1">(*Required)</span>
                  </div>
                  <Field name="password">
                    {({ field, meta }: FieldProps) => (
                      <TGInput
                        {...field}
                        type="password"
                        placeholder=""
                        className="text-text-str font-bold"
                        error={
                          meta.touched && meta.error ? meta.error : undefined
                        }
                      />
                    )}
                  </Field>
                </div>

                <div id="repassword-input-container">
                  <div className="block text-sm font-medium text-text-strong mb-2">
                    <span>Re-type New Password</span>
                    <span className="font-bold ml-1">(*Required)</span>
                  </div>
                  <Field name="rePassword">
                    {({ field, meta }: FieldProps) => (
                      <TGInput
                        {...field}
                        type="password"
                        placeholder=""
                        className="text-text-str font-bold"
                        error={
                          meta.touched && meta.error ? meta.error : undefined
                        }
                      />
                    )}
                  </Field>
                </div>
              </div>

              <TGButton
                className="mt-6"
                type="submit"
                disabled={isSubmitting}
                fullWidth
                size="xl"
                variant="primary"
              >
                Reset Password
              </TGButton>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ResetPasswordStep3;
