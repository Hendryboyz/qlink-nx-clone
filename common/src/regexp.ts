import * as Yup from 'yup';

export const phoneRegex: RegExp = /^(070|080|081|090|091)\d{8}$/;

export const clientPhoneRegex: RegExp = /^(070|080|081|090|091)\d{8}$/;

export const alphaMax50Regex: RegExp = /^[a-zA-Z]{1,50}$/;

export const addressStateRegex: RegExp = /^[a-zA-Z\s()]{1,50}$/;

export const alphaWithSpacesMax50Regex: RegExp = /^[a-zA-Z\s]{1,50}$/;

export const birthdayRegex: RegExp =
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const emailRegex: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex: RegExp =
  /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;


export const SignupSchema = Yup.object().shape({
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

  source: Yup.number().nullable(),

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
