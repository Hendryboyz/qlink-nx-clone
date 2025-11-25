import * as React from 'react';
import { cn } from '../../utils';

export interface TGButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

export const TGButton = React.forwardRef<HTMLButtonElement, TGButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full font-manrope font-medium transition-all focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-white disabled:border-0';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-500',
      secondary: 'bg-blue text-white hover:bg-blue-600',
      outline: 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'text-primary hover:bg-primary-50',
      white: 'bg-white text-primary hover:bg-gray-50',
    };

    const sizes = {
      xl: 'h-[46px] w-full max-w-[354px] px-6 text-base',
      lg: 'h-[40px] w-full max-w-[252px] px-6 text-base',
      md: 'h-[46px] w-[91px] px-4 text-base',
      sm: 'h-[25px] w-[51px] px-2 text-[10px]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    );
  }
);

TGButton.displayName = 'TGButton';
