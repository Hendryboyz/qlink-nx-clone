import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLDivElement> & {
  theme?: 'primary' | 'light' | 'transparent' | 'dark';
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  theme = 'primary',
  className,
  children,
  isLoading,
  ...props
}) => {
  const baseClasses =
    'py-2 text-sm flex justify-center items-center border-2 rounded-3xl';
  let themeClasses;
  switch (theme) {
    case 'primary': {
      themeClasses = 'bg-primary text-white border-primary';
      break;
    }
    case 'dark': {
      themeClasses = 'bg-primary-500 text-white border-primary-500';
      break;
    }
    case 'light': {
      themeClasses = 'bg-[#FFF0D3] border-primary text-primary';
      break;
    }
    case 'transparent': {
      themeClasses = 'border-none';
      break;
    }
  }

  return (
    <div className={`${themeClasses} ${baseClasses}  ${className}`} {...props}>
      {isLoading ? (
        <div className={`w-8 h-8 border-4 border-white
          ${theme == 'dark' ? 'border-t-primary-500' : 'border-t-primary'} rounded-full animate-spin`}></div>
      ) : (
        children
      )}
    </div>
  );
};

export default Button;
