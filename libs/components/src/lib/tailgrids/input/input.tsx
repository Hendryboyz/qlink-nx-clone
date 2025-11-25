'use client';

import * as React from 'react';
import { cn } from '../../utils';
import ViewIcon from './assets/view.svg';
import ViewOffIcon from './assets/view-off.svg';

export interface TGInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  fullWidth?: boolean;
}

export const TGInput = React.forwardRef<HTMLInputElement, TGInputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName,
      fullWidth = true,
      type,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || React.useId();
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={cn('flex flex-col gap-1.5 font-manrope', fullWidth && 'w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 font-manrope"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border border-gray-200',
              'bg-white text-gray-400 text-base font-manrope',
              'placeholder:text-gray-200',
              'transition-colors',
              '!outline-0 focus:!outline-0 focus-visible:!outline-0',
              'focus:border-gray-200 focus-visible:border-gray-200',
              'hover:border-gray-200',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
              error && 'border-[rgba(242,48,48,1)]',
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <img src={ViewOffIcon} alt="Hide password" className="w-5 h-5" />
              ) : (
                <img src={ViewIcon} alt="Show password" className="w-5 h-5" />
              )}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            'text-sm font-normal leading-[22px]',
            error ? 'text-[rgba(202,0,0,1)]' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

TGInput.displayName = 'TGInput';
