import * as React from 'react';
import { cn } from '../../utils';
import { Check, CheckIcon } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || React.useId();

    return (
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-6 h-6">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            className={cn(
              "peer appearance-none size-5 border border-stroke-w rounded-md bg-white",
              "checked:bg-primary checked:border-primary",
              "transition-all duration-200 cursor-pointer",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          <CheckIcon
            className="absolute size-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
            strokeWidth={3}
          />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-xs text-text-str cursor-pointer font-manrope select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
