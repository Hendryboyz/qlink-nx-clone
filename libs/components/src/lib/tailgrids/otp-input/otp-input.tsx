'use client';

import * as React from 'react';
import { cn } from '../../utils';

export interface TGOTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TGOTPInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  error = false,
  disabled = false,
  className,
}: TGOTPInputProps) {
  const [otp, setOtp] = React.useState<string[]>(Array(length).fill(''));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length);
      setOtp([...otpArray, ...Array(length - otpArray.length).fill('')]);
    }
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    if (disabled) return;

    // Only allow numbers
    if (newValue && !/^\d+$/.test(newValue)) return;

    const newOtp = [...otp];
    newOtp[index] = newValue.slice(-1); // Take only the last character
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onChange?.(otpString);

    // Move to next input if value is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all fields are filled
    if (newOtp.every((digit) => digit !== '') && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(length - newOtp.length).fill('')]);
    onChange?.(pastedData);

    // Focus the next empty input or the last input
    const nextEmptyIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextEmptyIndex]?.focus();

    if (newOtp.length === length && onComplete) {
      onComplete(pastedData);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={cn('flex gap-2 justify-center font-manrope', className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          className={cn(
            'w-12 h-14 text-center text-2xl font-semibold font-manrope',
            'rounded-lg border-2 border-gray-300',
            'bg-white text-gray-900',
            'transition-all',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            'hover:border-gray-400',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
