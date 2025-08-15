import { Field } from 'formik';
import React, { useState } from 'react';

type InputFieldProps = {
  type?: string;
  name: string;
  placeholder: string;
  headIconSource?: string;
  customClassName?: string;
  autoComplete?: boolean;
};

export default function InputField({ type = "text", name, placeholder, headIconSource, customClassName, autoComplete }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <label htmlFor={name}>
      <div
        className={`flex items-center bg-white p-2 rounded-xl border-[1px] w-full min-h-[48px] ${customClassName} ${
          !headIconSource && 'px-5'
        }`}
      >
        {headIconSource && <img src={headIconSource} alt={name} className="flex-shrink-0" />}
        <Field
          id={name}
          name={name}
          placeholder={placeholder}
          type={showPassword ? 'text' : type}
          className="flex-grow ml-2 placeholder:text-sm text-sm font-gilroy-medium outline-none border-none bg-transparent align-middle"
          style={{ lineHeight: 'normal', verticalAlign: 'middle' }}
          autoComplete={autoComplete ? 'on' : 'off'}
        />
        {type === 'password' && (
          <img
            src="assets/eye.svg"
            alt="phone"
            className={`flex-shrink-0 cursor-pointer ${headIconSource && '-ml-6'}`}
            onClick={() => setShowPassword((prevState) => !prevState)}
          />
        )}
      </div>
    </label>
  );
}
