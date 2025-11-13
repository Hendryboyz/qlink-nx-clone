'use client';

import * as React from 'react';
import { cn } from '../../utils';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export interface TGToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
  className?: string;
}

const icons = {
  success: <CheckCircle className="w-6 h-6" />,
  error: <XCircle className="w-6 h-6" />,
  warning: <AlertCircle className="w-6 h-6" />,
  info: <Info className="w-6 h-6" />,
};

const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-orange-50 border-orange-200 text-orange-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-orange-500',
  info: 'text-blue-500',
};

export function TGToast({
  type = 'success',
  title,
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
        'flex items-start gap-4 p-4 rounded-lg border-2 shadow-lg max-w-md',
        'animate-in slide-in-from-top-5 duration-300',
        typeStyles[type],
        className
      )}
      role="alert"
    >
      <div className={cn('flex-shrink-0 mt-0.5', iconStyles[type])}>
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-sm mb-1">{title}</p>
        )}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
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
    <div className={cn('fixed z-50 flex flex-col gap-2', positionStyles[position])}>
      {children}
    </div>
  );
}
