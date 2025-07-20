import { Field, FieldAttributes } from 'formik';
import React from 'react';
import { useField } from 'formik';

type Option = {
  value: string | number,
  label?: string
}
interface Props extends FieldAttributes<any> {
  options: Option[];
  children?: React.ReactNode;
}

const DropdownField: React.FC<Props> = ({
  name,
  label,
  options,
  placeholder,
  children,
  className,
  ...rest
}) => {
  return (
    <div>
      <label htmlFor={label} className="flex items-center justify-between">
        <Field
          as="select"
          id={name}
          name={name}
          className={`w-full appearance-none focus:outline-none bg-transparent border-none ${className}`}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label ? option.label : option.value}
            </option>
          ))}
        </Field>
        <img src="/assets/chevron_down.svg" />
      </label>
      {children && <div className="min-h-7">{children}</div>}
    </div>
  );
};

export default DropdownField;
