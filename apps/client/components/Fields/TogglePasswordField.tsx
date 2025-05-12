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
        className="absolute"
        style={{ right: 25, top: '28%' }}
      />
    </div>
  )

}
