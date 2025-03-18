import React, { Fragment, useState } from 'react';
import Container from './Container';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from '$/utils/fetch';
import { RegisterDto, UserSourceType, UserType } from 'types/src';
import { usePayload } from './PayloadContext';
import { CODE_SUCCESS, fromDate, HEADER_PRE_TOKEN, passwordRegex, STATES, typedObjectEntries, UserSourceDisplay } from '@org/common';
import SubmitButton from '$/components/Button/SubmitButton';
import { DayPicker } from 'react-day-picker';
import DatePickerClassNames from 'react-day-picker/style.module.css';
import DropdownField from '$/components/Dropdown';
import { usePopup } from '$/hooks/PopupProvider';
import { DEFAULT_ERROR_MSG } from 'common/src';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(50, 'First name must be at most 50 characters long.')
    .required('First name is required.'),

  midName: Yup.string()
    .max(50, 'Middle name must be at most 50 characters long.'),

  lastName: Yup.string()
    .max(50, 'Last name must be at most 50 characters long.')
    .required('Last name is required.'),

  addressState: Yup.string()
    .required('State is required.'),

  addressCity: Yup.string()
    .required('City is required.'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long.')
    .matches(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
    )
    .required('Password is required.'),

  rePassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),

  birthday: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format.')
    .nullable(),

  source: Yup.number()
    .nullable(),

  email: Yup.string()
    .email('Please enter a valid email address.')
    .nullable(),

  whatsapp: Yup.string()
    .nullable(),

  facebook: Yup.string()
    .nullable(),

  addressDetail: Yup.string()
    .nullable(),
});
interface FormData {
  password: string;
  rePassword: string;
  firstName: string;
  midName: string;
  lastName: string;
  addressState: string;
  addressCity: string;
  birthday: string;
  source: number;
  email: string;
  whatsapp: string;
  facebook: string;
  addressDetail: string;
}
const defaultValue: FormData = {
  password: '',
  rePassword: '',
  firstName: '',
  midName: '',
  lastName: '',
  email: '',
  addressState: '',
  addressCity: '',
  addressDetail: '',
  birthday: '',
  source: 0,
  whatsapp: '',
  facebook: '',
};

const DEFAULT_INPUT_STYLES =
  'block items-center justify-center rounded-xl py-5 pl-8 pr-6 w-full bg-white border-white border-2 font-bold text-xs';

const DEFAULT_ERROR_MSG_CLASS = 'text-red-500 absolute';
type Props = {
  onSuccess: () => void;
};

const Step3 = (props: Props) => {
  const initValue: FormData = defaultValue;
  const [showPassword, togglePassword] = useState(false);
  const [showRePassword, toggleRePassword] = useState(false);
  const [showDatePicker, toggleDatePicker] = useState(false);
  const { phone, token } = usePayload();
  const {showPopup} = usePopup()
  return (
    <Container title="Account detail" step={3}>
      <Formik
        initialValues={initValue}
        validationSchema={SignupSchema}
        onSubmit={(values, { setSubmitting }) => {
          const payload: RegisterDto = {
            phone: phone || 'None',
            type: UserType.CLIENT,
            password: values.password,
            rePassword: values.rePassword,
            firstName: values.firstName,
            midName: values.midName,
            lastName: values.lastName,
            addressState: values.addressState,
            addressCity: values.addressCity,
            addressDetail: values.addressDetail,
            birthday: values.birthday,
            source: UserSourceType.NONE,
            email: values.email,
            whatsapp: values.whatsapp,
            facebook: values.facebook,
          };
          setSubmitting(true);
          API
            .post('/auth/register', payload, {
              headers: {
                [HEADER_PRE_TOKEN]: token,
              },
            })
            .then((res) => {
              if (res.bizCode == CODE_SUCCESS) props.onSuccess();
              else {
                showPopup({ title: DEFAULT_ERROR_MSG})
              }
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <Fragment>
            <h4 className="text-primary text-xl mt-20">Enter Account Detail</h4>
            <div className="flex-1 overflow-auto mt-6 -mx-3">
              <form onSubmit={handleSubmit} className="h-full overflow-auto">
                <div className="space-y-6 ml-2 mr-4">
                  <div className={DEFAULT_INPUT_STYLES}>
                    <p className="text-gray-300">{phone}</p>
                  </div>
                  <label htmlFor="password">
                    <div className="relative">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className={`${DEFAULT_INPUT_STYLES} pr-12`}
                      />
                      <img
                        src="assets/eye.svg"
                        alt="hidden"
                        onClick={() => togglePassword((pre) => !pre)}
                        className="absolute"
                        style={{ right: 18, top: 20 }}
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </label>
                  <label htmlFor="rePassword">
                    <div className="relative">
                      <Field
                        id="rePassword"
                        name="rePassword"
                        type={showRePassword ? 'text' : 'password'}
                        placeholder="Re-enter Password"
                        className={`${DEFAULT_INPUT_STYLES} pr-12`}
                      />
                      <img
                        src="assets/eye.svg"
                        alt="hidden"
                        onClick={() => toggleRePassword((pre) => !pre)}
                        className="absolute"
                        style={{ right: 18, top: 20 }}
                      />
                    </div>
                    <ErrorMessage
                      name="rePassword"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </label>
                  <label htmlFor="firstName">
                    <Field
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      className={DEFAULT_INPUT_STYLES}
                    />
                    <ErrorMessage
                      name="firstName"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </label>
                  <label htmlFor="midName">
                    <Field
                      id="midName"
                      name="midName"
                      placeholder="Mid Name"
                      className={DEFAULT_INPUT_STYLES}
                    />
                    <ErrorMessage
                      name="midName"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </label>
                  <label htmlFor="lastName">
                    <Field
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      className={DEFAULT_INPUT_STYLES}
                    />
                    <ErrorMessage
                      name="lastName"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </label>
                  <DropdownField
                    label="addressState"
                      id="addressState"
                      name="addressState"
                      placeholder="State"
                      className={DEFAULT_INPUT_STYLES}
                      options={STATES.map(value => ({value}))}
                  >
                    <ErrorMessage
                      name="addressState"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                    </DropdownField>
                  <label htmlFor="addressCity">
                    <Field
                      id="addressCity"
                      name="addressCity"
                      placeholder="City"
                      className={DEFAULT_INPUT_STYLES}
                    />
                    <ErrorMessage
                      name="addressCity"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </label>
                  <label htmlFor="birthday">
                    <Field
                      id="birthday"
                      name="birthday"
                      placeholder="Birthday"
                      className={DEFAULT_INPUT_STYLES}
                      onClick={() => toggleDatePicker((p) => !p)}
                    />
                    <ErrorMessage
                      name="birthday"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                    <div className="absolute z-10 bg-white shadow-lg">
                      {showDatePicker && (
                        <DayPicker
                          mode="single"
                          selected={new Date(values.birthday)}
                          classNames={DatePickerClassNames}
                          // styles={{
                          //   root: {
                          //     borderRadius: '50%'
                          //   }
                          // }}
                          onSelect={(d) =>
                            setFieldValue('birthday', fromDate(d || new Date()))
                          }
                          onDayClick={() => toggleDatePicker(false)}
                        />
                      )}
                    </div>
                  </label>
                  <DropdownField
                    label="Source"
                      id="Source"
                      name="Source"
                      placeholder="Source"
                      className={DEFAULT_INPUT_STYLES}
                      options={typedObjectEntries(UserSourceType)
                        .filter(([k, v]) => {
                          return isNaN(Number(k)) && v !== UserSourceType.NONE
                        })
                        .map(([k, v]) => ({value: Number(v), label: UserSourceDisplay[v]}))}
                  >
                    <ErrorMessage
                      name="source"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                    </DropdownField>
                  <label htmlFor="email">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      className={DEFAULT_INPUT_STYLES}
                    />
                    <ErrorMessage
                      name="email"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </label>
                  <label htmlFor="whatsapp">
                    <Field
                      id="whatsapp"
                      name="whatsapp"
                      placeholder="Whatsapp ID"
                      className={DEFAULT_INPUT_STYLES}
                    />
                    <ErrorMessage
                      name="whatsapp"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </label>
                  <label htmlFor="facebook">
                    <Field
                      id="facebook"
                      name="facebook"
                      placeholder="Facebook ID"
                      className={DEFAULT_INPUT_STYLES}
                    />
                    <ErrorMessage
                      name="facebook"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </label>
                  <div className="flex justify-between items-center mt-8">
                    <span className="text-xl text-white">Next</span>
                    <SubmitButton
                      isLoading={isSubmitting}
                      onClick={() => handleSubmit()}
                    />
                  </div>
                </div>
              </form>
            </div>
          </Fragment>
        )}
      </Formik>
    </Container>
  );
};

export default Step3;
