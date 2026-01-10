'use client';

import * as React from 'react';
import { cn } from '../../utils';
import { ReactComponent as ViewIcon } from './assets/view.svg';
import { ReactComponent as ViewOffIcon } from './assets/view-off.svg';

export interface FloatingLabelInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label: string;
  error?: string;
  errorIcon?: React.ReactNode;
  containerClassName?: string;
}

export const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(({ className, label, error, errorIcon, containerClassName, type, id, value, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputId = id || React.useId();
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const hasValue = value !== undefined && value !== '';

  return (
    <div className={cn('flex flex-col gap-1.5 font-manrope w-full', containerClassName)}>
      <div
        className={cn(
          'relative w-full rounded-lg border bg-white transition-colors',
          error ? 'border-error' : 'border-stroke-w',
          'focus-within:border-stroke-s'
        )}
      >
        <div className="relative px-4 py-2.5 h-[61px] flex flex-col justify-center">
          {/* Floating label */}
          <label
            htmlFor={inputId}
            className="block text-xs font-normal leading-[75%] font-manrope text-primary"
          >
            {label}
          </label>

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            className={cn(
              'w-full bg-transparent text-base font-bold text-text-str font-manrope',
              'border-0 p-0 mt-2',
              'placeholder:text-stroke-s placeholder:font-normal',
              '!outline-none focus:!outline-none focus-visible:!outline-none',
              'disabled:cursor-not-allowed disabled:opacity-60',
              isPassword && 'pr-8',
              className
            )}
            {...props}
          />

          {/* Password toggle button */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stroke-s hover:text-text-str transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <ViewOffIcon className="w-5 h-5" />
              ) : (
                <ViewIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 px-1">
          {errorIcon}
          <span className="text-xs font-normal text-error leading-[140%]">{error}</span>
        </div>
      )}
    </div>
  );
});

FloatingLabelInput.displayName = 'FloatingLabelInput';
