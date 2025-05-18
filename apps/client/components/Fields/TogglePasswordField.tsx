import React, { InputHTMLAttributes, useState } from 'react';
import { Field } from 'formik';

export default function TogglePasswordField({name, ...props}: InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, togglePassword] = useState(false);
  return (
    <div>
      <Field
        name={name}
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <img
        src="assets/eye.svg"
        alt="hidden"
        onClick={() => togglePassword((pre) => !pre)}
        className="absolute top-1/2 right-[25px] transform -translate-y-1/2"
      />
    </div>
  )

}
