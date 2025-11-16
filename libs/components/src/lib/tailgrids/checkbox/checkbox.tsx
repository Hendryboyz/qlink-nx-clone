'use client';

import * as React from 'react';
import { cn } from '../../utils';
import { Check } from 'lucide-react';

export interface TGCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
}

export const TGCheckbox = React.forwardRef<HTMLInputElement, TGCheckboxProps>(
  ({ className, label, description, error, containerClassName, id, ...props }, ref) => {
    const checkboxId = id || React.useId();

    return (
      <div className={cn('flex items-center gap-3 font-manrope', containerClassName)}>
        <div className="relative flex items-center flex-shrink-0">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            className={cn(
              'peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300',
              'transition-all checked:bg-primary checked:border-primary',
              'hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          <Check
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity'
            )}
            strokeWidth={3}
          />
        </div>
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'block text-sm font-medium text-gray-900 cursor-pointer leading-5 font-manrope',
                  props.disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
            )}
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

TGCheckbox.displayName = 'TGCheckbox';
