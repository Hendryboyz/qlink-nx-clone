'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { cn } from '../../utils';
import { Calendar } from './calendar/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';
import { ReactComponent as CalendarIcon } from './assets/calendar.svg';

export interface DatePickerWithInputProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  label?: string;
  error?: string;
  disabledDates?: (date: Date) => boolean;
}

export function DatePickerWithInput({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  className,
  dateFormat = 'PPP',
  label,
  error,
  disabledDates,
}: DatePickerWithInputProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange?.(newDate);
  };

  return (
    <div className={cn('flex flex-col gap-1.5 w-full font-manrope', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 font-manrope">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border border-gray-200',
              'bg-white text-base font-manrope',
              'flex items-center justify-between text-left',
              'transition-colors',
              '!outline-0 focus:!outline-0 focus-visible:!outline-0',
              'focus:border-gray-200 focus-visible:border-gray-200',
              'hover:border-gray-200',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
              date ? 'text-gray-400 font-bold' : 'text-gray-200 font-normal',
              error && 'border-[rgba(242,48,48,1)]'
            )}
          >
            <span>{date ? format(date, dateFormat) : placeholder}</span>
            <CalendarIcon className="w-[13px] h-[15px] ml-2 text-text-str" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white shadow-effect-overlay" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={disabledDates}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm font-normal leading-[22px] text-[rgba(202,0,0,1)]">{error}</p>
      )}
    </div>
  );
}
