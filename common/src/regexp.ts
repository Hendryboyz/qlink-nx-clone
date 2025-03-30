export const phoneRegex: RegExp = /^\d{12}$/;

export const clientPhoneRegex: RegExp = /^(234)[0-9]{0,9}$/;

export const alphaMax50Regex: RegExp = /^[a-zA-Z]{1,50}$/;

export const alphaWithSpacesMax50Regex: RegExp = /^[a-zA-Z\s]{1,50}$/;

export const birthdayRegex: RegExp =
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const emailRegex: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex: RegExp =
  /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
