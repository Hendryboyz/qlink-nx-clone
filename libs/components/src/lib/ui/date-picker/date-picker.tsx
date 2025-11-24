'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from './button/button';
import { Calendar } from './calendar/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';

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
  placeholder = '選擇日期',
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
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal font-manrope',
              !date && 'text-muted-foreground',
              error && 'border-red-500 focus:ring-red-500/20'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, dateFormat) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={disabledDates}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
