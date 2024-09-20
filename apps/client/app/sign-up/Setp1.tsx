import { Fragment } from 'react';
import Container from './Container';
import { Formik, FormikErrors, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import API from '$/utils/fetch';
import { OtpTypeEnum } from 'types/src';
import { CODE_SUCCESS } from 'common/src';
import { usePayload } from './PayloadContext';
import SubmitButton from '$/components/Button/SubmitButton';

interface FormData {
  phone: string;
}
type Props = {
  onSuccess: () => void;
};

const Step1 = (props: Props) => {
  const { setPhone } = usePayload()
  const initValue: FormData = { phone: '' };

  return (
    <Container title="Create an account" step={1}>
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
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          setSubmitting(true)
          const phone = String(values.phone)
          API.post('/auth/otp/send', {
            phone,
            type: OtpTypeEnum.REGISTER
          })
          .then(res => {
           if (res.bizCode == CODE_SUCCESS) {
            setPhone(phone)
            props.onSuccess()
           }
            else {
              setFieldError('phone', res.message)
          } 
          })
          .finally(() => setSubmitting(false))
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
          isValid,
        }) => (
          <Fragment>
            <div>
              <h4 className="text-primary text-xl mt-20">
                Mobile Verification
              </h4>
              <form>
                <div className="mt-6">
                  <label htmlFor="phone">
                    <div className="flex items-center bg-white border-white p-4 rounded-xl border-2 w-full">
                      <img src="assets/phone.svg" alt="phone" />
                      <Field
                        id="phone"
                        name="phone"
                        placeholder="Mobile Number"
                        type="number"
                        className="flex-grow ml-2"
                      />
                    </div>
                  </label>
                  <ErrorMessage
                    name="phone"
                    className="text-red-500"
                    component="span"
                  />
                </div>
              </form>
            </div>
            <div className='mt-auto'>
              <div className="flex justify-between items-center mb-11">
                <span className="text-xl text-white">Sign Up</span>
                <SubmitButton
                  isLoading={isSubmitting}
                  onClick={() => {
                    if (isValid) handleSubmit()
                  }}
                />
              </div>
              <p className="text-white text-center">
                Already a member?&nbsp;
                <Link href="/sign-in">
                  <span className="">Log in</span>
                </Link>
              </p>
            </div>
          </Fragment>
        )}
      </Formik>
    </Container>
  );
};

export default Step1;
