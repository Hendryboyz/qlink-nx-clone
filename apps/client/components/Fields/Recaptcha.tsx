import { Field } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormikErrors } from 'formik/dist/types';

type RecaptchaProps = {
  recaptchaToken: string;
  recaptchaError?: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<any>>
}

const Recaptcha = (props: RecaptchaProps) => {
  const recaptchaSitekey = process.env.NEXT_PUBLIC_RECAPTHCA_SITEKEY || '';
  return (
    <>
      <Field
        type="hidden"
        id="recaptchaToken"
        name="recaptchaToken"
        value={props.recaptchaToken}
      />
      <ReCAPTCHA
        sitekey={recaptchaSitekey}
        onChange={async (token) => {
          await props.setFieldValue("recaptchaToken", token, true);
        }}
      />
      { props.recaptchaError ? (<span className="text-red-500">
        {props.recaptchaError}
      </span>) : null}
    </>
  )
}

export default Recaptcha;
