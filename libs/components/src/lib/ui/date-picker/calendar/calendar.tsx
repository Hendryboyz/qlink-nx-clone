'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { cn } from '../../../utils';
import { buttonVariants } from '../button/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout="dropdown"
      fromYear={1900}
      toYear={2100}
      formatters={{
        formatMonthDropdown: (date) => {
          return date.toLocaleString('en-US', { month: 'short' });
        },
      }}
      className={cn('p-3 font-manrope', className)}
      classNames={{
        months: cn('flex flex-col sm:flex-row gap-4 relative', defaultClassNames.months),
        month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
        month_caption: cn(
          'flex items-center justify-center h-9 w-full px-9',
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          'text-sm font-medium font-manrope select-none',
          'rounded-md pl-2 pr-1 flex items-center gap-1 h-8',
          '[&>svg]:text-gray-400 [&>svg]:size-3.5',
          defaultClassNames.caption_label
        ),
        dropdowns: cn(
          'w-full flex items-center text-sm font-medium justify-center h-9 gap-1.5',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative border border-gray-200 rounded-md',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn('absolute inset-0 opacity-0 cursor-pointer', defaultClassNames.dropdown),
        dropdown_month: 'w-auto',
        dropdown_year: 'w-auto',
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
          defaultClassNames.nav
        ),
        button_previous: cn(
          'h-7 w-7 bg-transparent p-0 hover:opacity-70 border-0 outline-none inline-flex items-center justify-center',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          'h-7 w-7 bg-transparent p-0 hover:opacity-70 border-0 outline-none inline-flex items-center justify-center',
          defaultClassNames.button_next
        ),
        table: 'w-full border-collapse space-y-1',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-gray-400 rounded-md w-9 font-normal text-xs font-manrope',
          defaultClassNames.weekday
        ),
        week: cn('flex w-full mt-2', defaultClassNames.week),
        day: cn(
          'h-9 w-9 text-center text-sm p-0 relative font-manrope flex items-center justify-center',
          defaultClassNames.day
        ),
        day_button: cn(
          'h-9 w-9 p-0 font-normal text-base font-manrope hover:bg-transparent',
          'rounded-md transition-colors',
          'aria-selected:bg-[#D70127] aria-selected:text-white aria-selected:font-bold',
          'hover:aria-selected:bg-[#D70127] hover:aria-selected:text-white'
        ),
        range_end: 'day-range-end',
        selected:
          'bg-[#D70127] text-white rounded-md hover:bg-[#D70127] hover:text-white focus:bg-[#D70127] focus:text-white',
        today: 'font-bold',
        outside:
          'day-outside text-gray-300 opacity-50',
        disabled: 'text-gray-300 opacity-50 cursor-not-allowed',
        range_middle:
          'aria-selected:bg-primary/10 aria-selected:text-gray-900',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
