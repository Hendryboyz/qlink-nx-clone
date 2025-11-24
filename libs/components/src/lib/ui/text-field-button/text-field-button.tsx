import { ChevronRight } from 'lucide-react';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface TextFieldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const TextFieldButton = React.forwardRef<HTMLButtonElement, TextFieldButtonProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          "flex w-full items-center justify-between rounded-lg border border-stroke-w bg-white px-4 py-3 text-left text-base font-medium text-gray-900 transition-colors disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        <span>{label}</span>
        <ChevronRight />
      </button>
    );
  }
);

TextFieldButton.displayName = 'TextFieldButton';
