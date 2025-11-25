'use client';

import * as React from 'react';
import { cn } from '../../utils';
import SuccessIcon from './assets/success.svg';
import FailIcon from './assets/fail.svg';

export interface TGToastProps {
  type?: 'success' | 'failed';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
  className?: string;
}

const icons = {
  success: <img src={SuccessIcon} alt="Success" className="w-5 h-5" />,
  failed: <img src={FailIcon} alt="Failed" className="w-5 h-5" />,
};

const typeStyles = {
  success: 'bg-[#DAF8E6] border-none shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)]',
  failed: 'bg-[#FEF3F3] border-none shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)]',
};

const textStyles = {
  success: 'text-[#004434] text-base font-medium leading-6',
  failed: 'text-[#8C1C21] text-sm font-medium leading-5',
};

export function TGToast({
  type = 'success',
  message,
  onClose,
  autoClose = true,
  autoCloseDuration = 5000,
  className,
}: TGToastProps) {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, onClose]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg max-w-md font-manrope',
        'animate-in slide-in-from-top-5 duration-300',
        typeStyles[type],
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0 font-manrope">
        <p className={cn(textStyles[type])}>{message}</p>
      </div>
    </div>
  );
}

// Toast Container for managing multiple toasts
export interface TGToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  children: React.ReactNode;
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function TGToastContainer({ position = 'top-right', children }: TGToastContainerProps) {
  return (
    <div className={cn('fixed z-50 flex flex-col gap-2 font-manrope', positionStyles[position])}>
      {children}
    </div>
  );
}
