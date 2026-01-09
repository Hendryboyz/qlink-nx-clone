import { type FC } from 'react';
import { Field, FieldProps, Formik, FormikErrors } from 'formik';
import { format } from 'date-fns';
import { CODE_SUCCESS, HEADER_PRE_TOKEN } from '@org/common';
import API from '$/utils/fetch';
import {
  GenderType,
  RegisterDto,
  UserSourceType,
  UserType,
} from '@org/types';
import {
  TGButton,
  TGInput,
  TGDropdown,
  DatePickerWithInput,
} from '@org/components';

interface FormData {
  password: string;
  rePassword: string;
  firstName: string;
  midName: string;
  lastName: string;
  birthday: Date | undefined;
  source: string;
  gender: string;
  phone: string;
  addressCity: string;
  addressState: string;
  facebook: string;
  whatsapp: string;
}

type SignUpStep3Props = {
  email: string;
  token: string;
  onSuccess: () => void;
};

export const SignUpStep3Title = () => {
  return (
    <div className="flex flex-col ml-1">
      <span className="text-base text-red-600 font-bold">Step 3</span>
      <h4 className="text-2xl font-bold text-text-str">
        Complete account detail
      </h4>
    </div>
  );
};

const SignUpStep3: FC<SignUpStep3Props> = ({ email, token, onSuccess }) => {
  const initValue: FormData = {
    password: '',
    rePassword: '',
    firstName: '',
    midName: '',
    lastName: '',
    birthday: undefined,
    source: '',
    gender: '',
    phone: '',
    addressCity: '',
    addressState: '',
    facebook: '',
    whatsapp: '',
  };

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const sourceOptions = [
    { label: 'Friends Or Family Referrals', value: UserSourceType.FriendsOrFamilyReferrals.toString() },
    { label: 'Online', value: UserSourceType.Online.toString() },
    { label: 'Retail Shop', value: UserSourceType.RetailShop.toString() },
    { label: 'Sales Event', value: UserSourceType.SalesEvent.toString() },
    { label: 'Service Center', value: UserSourceType.ServiceCenter.toString() },
  ];

  // Dummy data for City and State as we don't have an API for them yet
  const cityOptions = [
    { label: 'argo', value: 'argo' },
    { label: 'New York', value: 'New York' },
    { label: 'London', value: 'London' },
  ];

  const stateOptions = [
    { label: 'argo', value: 'argo' },
    { label: 'NY', value: 'NY' },
    { label: 'UK', value: 'UK' },
  ];

  return (
    <Formik
      initialValues={initValue}
      validate={(values) => {
        const errors: FormikErrors<FormData> = {};

        // Password validation
        if (!values.password) {
          errors.password = 'Required';
        } else {
          if (values.password.length < 8) {
            errors.password = 'At least 8 characters';
          }
          if (!/[a-zA-Z]/.test(values.password)) {
            errors.password = 'At least 1 English letter (a-z or A-Z)';
          }
          if (!/[0-9]/.test(values.password)) {
            errors.password = 'At least 1 digit (0-9)';
          }
        }

        if (!values.rePassword) {
          errors.rePassword = 'Required';
        } else if (values.password !== values.rePassword) {
          errors.rePassword = 'Passwords must match';
        }

        // First Name validation
        if (!values.firstName) {
          errors.firstName = 'Required';
        }

        // Last Name validation
        if (!values.lastName) {
          errors.lastName = 'Required';
        }

        // Phone validation
        if (!values.phone) {
          errors.phone = 'Required';
        }

        // Address City validation
        if (!values.addressCity) {
          errors.addressCity = 'Required';
        }

        // Address State validation
        if (!values.addressState) {
          errors.addressState = 'Required';
        }

        // Birthday validation (if provided, should be YYYY-MM-DD format)
        if (values.birthday) {
          const birthdayString = format(values.birthday, 'yyyy-MM-dd');
          if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdayString)) {
            errors.birthday = 'Birthday format should be YYYY-MM-DD';
          }
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        setSubmitting(true);
        const payload: RegisterDto = {
          email,
          password: values.password,
          rePassword: values.rePassword,
          firstName: values.firstName,
          midName: values.midName,
          lastName: values.lastName,
          birthday: values.birthday ? format(values.birthday, 'yyyy-MM-dd') : undefined,
          source: values.source ? Number(values.source) : undefined,
          gender: (values.gender as GenderType) || 'Male', // Default or handle error
          addressCity: values.addressCity,
          addressState: values.addressState,
          phone: values.phone,
          whatsapp: values.whatsapp,
          facebook: values.facebook,
          type: UserType.CLIENT,
        };

        API.post('/auth/register', payload, {
          headers: {
            [HEADER_PRE_TOKEN]: token,
          },
        })
          .then((res) => {
            const { bizCode } = res;
            if (bizCode === CODE_SUCCESS) {
              onSuccess();
            } else {
              // Handle general error or map to fields
              console.error(res.message);
            }
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
        <form
          className="flex flex-col flex-1 h-full mt-6 pb-10"
          onSubmit={handleSubmit}
        >
          <div className="flex-grow flex flex-col gap-4">
            <Field name="password">
              {({ field, meta }: FieldProps) => (
                <TGInput
                  {...field}
                  type="password"
                  label="Password (*Required)"
                  placeholder=""
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="rePassword">
              {({ field, meta }: FieldProps) => (
                <TGInput
                  {...field}
                  type="password"
                  label="Re-enter Password (*Required)"
                  placeholder=""
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="firstName">
              {({ field, meta }: FieldProps) => (
                <TGInput
                  {...field}
                  label="First Name (*Required)"
                  placeholder=""
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="midName">
              {({ field, meta }: FieldProps) => (
                <TGInput
                  {...field}
                  label="Middle Name"
                  placeholder=""
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="lastName">
              {({ field, meta }: FieldProps) => (
                <TGInput
                  {...field}
                  label="Last Name (*Required)"
                  placeholder=""
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="birthday">
              {({ field, meta }: FieldProps) => (
                <DatePickerWithInput
                  value={field.value}
                  onChange={(date) => setFieldValue('birthday', date)}
                  label="Birthday"
                  dateFormat="MMMM dd, yyyy"
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="source">
              {({ field, meta }: FieldProps) => (
                <TGDropdown
                  options={sourceOptions}
                  value={field.value}
                  onChange={(val) => setFieldValue('source', val)}
                  label="How did you hear about us?"
                  placeholder="Select source"
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="gender">
              {({ field, meta }: FieldProps) => (
                <TGDropdown
                  options={genderOptions}
                  value={field.value}
                  onChange={(val) => setFieldValue('gender', val)}
                  label="Gender"
                  placeholder="Select gender"
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="phone">
              {({ field, meta }: FieldProps) => (
                <TGInput
                  {...field}
                  label="Mobile (*Required)"
                  placeholder="0000-00-0000"
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="addressCity">
              {({ field, meta }: FieldProps) => (
                <TGDropdown
                  options={cityOptions}
                  value={field.value}
                  onChange={(val) => setFieldValue('addressCity', val)}
                  label="City/Town (*Required)"
                  placeholder="Select city"
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="addressState">
              {({ field, meta }: FieldProps) => (
                <TGDropdown
                  options={stateOptions}
                  value={field.value}
                  onChange={(val) => setFieldValue('addressState', val)}
                  label="State (*Required)"
                  placeholder="Select state"
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="facebook">
              {({ field, meta }: FieldProps) => (
                <TGInput
                  {...field}
                  label="Facebook ID"
                  placeholder=""
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>

            <Field name="whatsapp">
              {({ field, meta }: FieldProps) => (
                <TGInput
                  {...field}
                  label="Whatsapp ID"
                  placeholder="0000-00-0000"
                  error={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>
          </div>

          <div className="mt-8">
            <TGButton
              type="submit"
              fullWidth
              size="xl"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Create Account
            </TGButton>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default SignUpStep3;
