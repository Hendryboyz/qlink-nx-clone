'use client';

import * as React from 'react';
import { cn } from '../../utils';
import { X, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { TGButton } from '../button/button';

export interface TGModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCloseButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-orange-500',
    iconBgColor: 'bg-orange-100',
  },
  danger: {
    icon: AlertCircle,
    iconColor: 'text-red-500',
    iconBgColor: 'bg-red-100',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    iconBgColor: 'bg-blue-100',
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    iconBgColor: 'bg-green-100',
  },
};

export function TGModal({
  open,
  onClose,
  title,
  description,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCloseButton = true,
  className,
  children,
}: TGModalProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full',
          'transform transition-all',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={cn('p-3 rounded-full', config.iconBgColor)}>
            <Icon className={cn('w-8 h-8', config.iconColor)} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 id="modal-title" className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          {description && (
            <p id="modal-description" className="text-gray-600 text-sm">
              {description}
            </p>
          )}
          {children && <div className="mt-4 text-left">{children}</div>}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <TGButton
            variant="outline"
            fullWidth
            onClick={handleCancel}
          >
            {cancelText}
          </TGButton>
          <TGButton
            variant="primary"
            fullWidth
            onClick={handleConfirm}
          >
            {confirmText}
          </TGButton>
        </div>
      </div>
    </div>
  );
}
