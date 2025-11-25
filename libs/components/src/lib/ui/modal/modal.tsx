import * as React from 'react';
import { cn } from '../../utils';

export interface ModalProps {
  isOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        className={cn(
          "relative bg-white w-[300px] rounded-[30px] py-10 px-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col items-center text-center mb-2 gap-4 w-full", className)}>{children}</div>;
}

export function ModalIcon({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-primary mb-2", className)}>{children}</div>;
}

export function ModalTitle({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-bold text-text-str font-manrope", className)}>{children}</h3>;
}

export function ModalDescription({ className, children }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-stroke-s text-center font-manrope leading-relaxed px-2", className)}>{children}</p>;
}

export function ModalFooter({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-3 mt-8 w-full", className)}>{children}</div>;
}
