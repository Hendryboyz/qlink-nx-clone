import React, { Fragment } from 'react';
import Container from './Container';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from '$/utils/fetch';
import { GenderType, RegisterDto, UserType } from 'types/src';
import { usePayload } from '$/store/payload';
import {
  alphaWithSpacesMax50Regex, clientPhoneRegex,
  CODE_SUCCESS,
  GENDER,
  HEADER_PRE_TOKEN,
  passwordRegex,
  STATES,
} from '@org/common';
import SubmitButton from '$/components/Button/SubmitButton';
import DateField from '$/components/Fields/DateField';
import DropdownField from '$/components/Dropdown';
import { usePopup } from '$/hooks/PopupProvider';
import { DEFAULT_ERROR_MSG } from 'common/src';
import InputField from '$/components/Fields/InputField';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(50, 'At most 50 characters long.')
    .required('Required.'),

  midName: Yup.string()
    .max(50, 'At most 50 characters long.'),

  lastName: Yup.string()
    .max(50, 'At most 50 characters long.')
    .required('Required.'),

  password: Yup.string()
    .min(6, 'Must be at least 6 characters long.')
    .matches(
      passwordRegex,
      'Must include letter and number.'
    )
    .required('Password is required.'),

  rePassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Confirm your password.'),

  birthday: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format.')
    .nullable(),

  // source: Yup.number().nullable(),

  gender: Yup.string().required('Required.'),

  phone: Yup.string()
    .matches(clientPhoneRegex, 'Invalid phone format')
    .required('Phone is required.'),

  addressCity: Yup.string()
    .matches(alphaWithSpacesMax50Regex, 'Only allow letter(a-z, A-Z and space)')
    .required('Required.'),

  addressState: Yup.string().required('Required.'),

  whatsapp: Yup.string().nullable(),

  facebook: Yup.string().nullable(),

  addressDetail: Yup.string().nullable(),
});

interface FormData {
  phone: string;
  password: string;
  rePassword: string;
  firstName: string;
  midName: string;
  lastName: string;
  addressState: string;
  addressCity: string;
  birthday: string;
  gender: GenderType;
  // source: number;
  whatsapp: string;
  facebook: string;
  addressDetail: string;
}

const defaultValue: FormData = {
  phone: '',
  password: '',
  rePassword: '',
  firstName: '',
  midName: '',
  lastName: '',
  addressState: '',
  addressCity: '',
  addressDetail: '',
  birthday: '',
  gender: 'Male',
  // source: 0,
  whatsapp: '',
  facebook: '',
};

const DEFAULT_INPUT_STYLES =
  'block rounded-xl py-2 pl-6 pr-6 w-full bg-white border-[#FFCFA3] border-[1px] text-sm font-gilroy-medium min-h-[48px]';

const DEFAULT_ERROR_MSG_CLASS = 'text-red-500 pl-6 text-sm font-gilroy-medium';

type Props = {
  onSuccess: () => void;
  goBack: () => void;
};
const Step3 = (props: Props) => {
  const initValue: FormData = defaultValue;
  // Remove showDatePicker state
  // const [showDatePicker, toggleDatePicker] = useState(false);
  const {email, token} = usePayload();
  const {showPopup} = usePopup();
  // const sourceOptions = typedObjectEntries(UserSourceType)
  //   .filter(([k, v]) => {
  //     return isNaN(Number(k)) && v !== UserSourceType.NONE
  //   })
  //   .map(([_, v]) => ({value: v, label: UserSourceDisplay[v]}))

  return (
    <Container title="Account detail" step={3}>
        <h4 className="text-primary text-xl">Enter Account Detail</h4>
      <div>
        <Formik
        initialValues={initValue}
        validationSchema={SignupSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          const payload: RegisterDto = {
            email: email || 'None',
            type: UserType.CLIENT,
            password: values.password,
            rePassword: values.rePassword,
            firstName: values.firstName,
            midName: values.midName,
            lastName: values.lastName,
            gender: values.gender,
            addressState: values.addressState,
            addressCity: values.addressCity,
            addressDetail: values.addressDetail,
            birthday: values.birthday,
            phone: values.phone,
            // source: Number(values.source),
            whatsapp: values.whatsapp,
            facebook: values.facebook,
          };

          setSubmitting(true);
          API.post('/auth/register', payload, {
            headers: {
              [HEADER_PRE_TOKEN]: token,
            },
          })
            .then((res) => {
              if (res.bizCode == CODE_SUCCESS) props.onSuccess();
              else {
                showPopup({ title: DEFAULT_ERROR_MSG });
              }
            })
            .catch((e) => {
              showPopup({ title: DEFAULT_ERROR_MSG });
              console.error(e);
              const { type: field, message } = e.data.data.error;
              setFieldError(field, message);
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
            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                <div>
                  {/* <label id="email">
                    <div className={`flex items-center ${DEFAULT_INPUT_STYLES} mb-7 h-12`}>
                      <span className="text-gray-300 text-lg font-gilroy-medium">{email || "user@example.com"}</span>
                    </div>
                  </label> */}
                  <div>
                    <InputField
                      name="password"
                      type="password"
                      placeholder="Password"
                      customClassName="border-[#FFCFA3] pr-5"
                    />
                    <div className="min-h-7">
                      <ErrorMessage name="password">
                        {(msg) => <span className="text-red-500 pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div>
                    <InputField
                      name="rePassword"
                      type="password"
                      placeholder="Re-enter Password"
                      customClassName="border-[#FFCFA3] pr-5"
                    />
                    <div className="min-h-7">
                      <ErrorMessage name="rePassword">
                        {(msg) => <span className="text-red-500 pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div>
                    <InputField
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      customClassName="border-[#FFCFA3] pr-5"
                    />
                    <div className="min-h-7">
                      <ErrorMessage name="firstName">
                        {(msg) => <span className="text-red-500 pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div>
                    <InputField
                      name="midName"
                      type="text"
                      placeholder="Mid Name"
                      customClassName="border-[#FFCFA3] pr-5"
                    />
                    <div className="min-h-7">
                      <ErrorMessage name="midName">
                        {(msg) => <span className="text-red-500 pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div>
                    <InputField
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      customClassName="border-[#FFCFA3] pr-5"
                    />
                    <div className="min-h-7">
                      <ErrorMessage name="lastName">
                        {(msg) => <span className="text-red-500 pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                  <label htmlFor="birthday">
                    <DateField
                      name="birthday"
                      defaultDisplayValue="Birthday"
                      className={DEFAULT_INPUT_STYLES}
                    />
                    <div className="min-h-7">
                      <ErrorMessage
                        name="birthday"
                        className={DEFAULT_ERROR_MSG_CLASS}
                        component="span"
                      />
                    </div>
                  </label>
                  <DropdownField
                    label="gender"
                    id="gender"
                    name="gender"
                    placeholder="Gender"
                    className={DEFAULT_INPUT_STYLES}
                    textSize="text-sm"
                    options={GENDER.map((value) => ({ value: value }))}
                  >
                    <ErrorMessage
                      name="gender"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </DropdownField>
                  <div>
                    <InputField
                      name="phone"
                      placeholder="Mobile"
                      customClassName="border-[#FFCFA3]"
                    />
                    <div className="min-h-7">
                      <ErrorMessage name="phone">
                        {(msg) => <span className="text-red-500 pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                  {/*<DropdownField*/}
                  {/*  label="source"*/}
                  {/*  id="source"*/}
                  {/*  name="source"*/}
                  {/*  placeholder="Source"*/}
                  {/*  className={DEFAULT_INPUT_STYLES}*/}
                  {/*  options={sourceOptions}*/}
                  {/*>*/}
                  {/*  <ErrorMessage*/}
                  {/*    name="source"*/}
                  {/*    className={DEFAULT_ERROR_MSG_CLASS}*/}
                  {/*    component="span"*/}
                  {/*  />*/}
                  {/*</DropdownField>*/}
                  <div>
                    <InputField
                      type="text"
                      name="addressCity"
                      placeholder="City"
                      customClassName="border-[#FFCFA3]"
                    />
                    <div className="min-h-7">
                      <ErrorMessage name="addressCity">
                        {(msg) => <span className="text-red-500 pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                  <DropdownField
                    label="addressState"
                    id="addressState"
                    name="addressState"
                    placeholder="State"
                    className={DEFAULT_INPUT_STYLES}
                    textSize="text-sm"
                    options={STATES.map((value) => ({ value }))}
                  >
                    <ErrorMessage
                      name="addressState"
                      className={DEFAULT_ERROR_MSG_CLASS}
                      component="span"
                    />
                  </DropdownField>
                  <div>
                    <InputField
                      name="whatsapp"
                      placeholder="Whatsapp ID"
                      customClassName="border-[#FFCFA3]"
                    />
                    <div className="min-h-7">
                      <ErrorMessage name="whatsapp">
                        {(msg) => <span className="text-red-500 pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div>
                    <InputField
                      name="facebook"
                      placeholder="Facebook ID"
                      customClassName="border-[#FFCFA3]"
                    />
                    <div className="min-h-7">
                      <ErrorMessage name="whatsapp">
                        {(msg) => <span className="text-red-500 pl-6 text-sm font-gilroy-medium">{msg}</span>}
                      </ErrorMessage>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-8">
                    <span
                      className="text-xl text-red-600 hover:underline hover:cursor-pointer"
                      onClick={props.goBack}
                    >
                      Back
                    </span>
                    <SubmitButton
                      text="Next"
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
      </div>
    </Container>
  );
};

export default Step3;
