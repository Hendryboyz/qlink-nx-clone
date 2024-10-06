import { Field, FieldAttributes } from 'formik';
import React from 'react';

type Option = {
  value: string | number,
  label?: string
}
interface Props extends FieldAttributes<any> {
  options: Option[];
  children?: React.ReactNode;
}

const DropdownField: React.FC<Props> = ({name, options, placeholder, children, className, ...rest}) => {
  return (
    <div className='flex items-center justify-between'>
      <Field
        as="select"
        id={name}
        name={name}
        className={`w-full appearance-none focus:outline-none ${className}`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled selected hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label ? option.label : option.value}
          </option>
        ))}
      </Field>
      {children}
        <img src="/assets/arrow_down.png" />
    </div>
  );
};

export default DropdownField;
