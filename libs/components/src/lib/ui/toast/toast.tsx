import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Gift } from 'lucide-react';
import { cn } from '../../utils';
import TicketIcon from './assets/Ticket';
import SucessCheckIcon from './assets/SuccessCheck';
import FailedXIcon from './assets/FailedX';
import CloseIcon from './assets/Close';
import { twMerge } from 'tailwind-merge';

const toastVariants = cva(
  'flex items-center justify-between w-full max-w-md p-4 rounded-lg shadow-sm transition-all font-manrope gap-3',
  {
    variants: {
      variant: {
        default: 'bg-text-str text-white',
        success: 'bg-[#DAF8E6] text-success',
        error: 'bg-[#FEF3F3] text-error',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  icon: 'TICKET' | 'GIFT' | 'SUCCESS' | 'ERROR';
  onClose?: () => void;
  onViewClick?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { className, variant, icon, children, onClose, onViewClick, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0 size-5">
            {icon === 'TICKET' && <TicketIcon className="text-warning" />}
            {icon === 'GIFT' && <Gift className="text-warning" />}
            {icon === 'SUCCESS' && <SucessCheckIcon className="text-success" />}
            {icon === 'ERROR' && <FailedXIcon className="text-error" />}
          </div>
          <div className="text-sm font-bold">{children}</div>
        </div>

        {variant === 'default' && (
          <button
            className="text-sm font-bold text-white"
            onClick={() => onViewClick?.()}
          >
            View
          </button>
        )}

        {variant != 'default' && (
          <button
            onClick={() => onClose?.()}
            className="flex-shrink-0 rounded-full p-1 transition-colors text-gray-400 hover:text-white hover:bg-white/10"
          >
            <CloseIcon
              className={
                twMerge(
                  'w-4 h-4',
                  variant === 'success' && 'text-success',
                  variant === 'error' && 'text-error'
                )
              }
            />
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = 'Toast';

export { Toast, toastVariants };
