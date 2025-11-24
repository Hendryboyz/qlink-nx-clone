import type { Meta, StoryObj } from '@storybook/react';
import { DatePickerWithInput } from './date-picker';
import { useState } from 'react';
import { addDays, subDays } from 'date-fns';

const meta: Meta<typeof DatePickerWithInput> = {
  title: 'Shadcn/DatePicker',
  component: DatePickerWithInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePickerWithInput>;

export const Default: Story = {
  args: {
    placeholder: 'Select date',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Date of birth',
    placeholder: 'Select date of birth',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Default date',
    value: new Date(),
  },
};

export const WithError: Story = {
  args: {
    label: 'Required date',
    placeholder: 'Select date',
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled date picker',
    value: new Date(),
    disabled: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
      <div className="space-y-4">
        <DatePickerWithInput
          label="Select date"
          value={date}
          onChange={setDate}
          placeholder="Choose a date"
        />
        <div className="text-sm text-gray-600">
          Selected date: {date ? date.toLocaleDateString('en-US') : '(None)'}
        </div>
        <button
          onClick={() => setDate(undefined)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          Clear date
        </button>
      </div>
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    // Disable past dates
    const disablePastDates = (date: Date) => {
      return date < subDays(new Date(), 1);
    };

    return (
      <div className="space-y-4">
        <DatePickerWithInput
          label="Select future date"
          value={date}
          onChange={setDate}
          placeholder="Can only select today or future dates"
          disabledDates={disablePastDates}
        />
        <p className="text-sm text-gray-600">
          Past dates are disabled
        </p>
      </div>
    );
  },
};

export const DateRange: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    return (
      <div className="space-y-4 max-w-md">
        <DatePickerWithInput
          label="Start date"
          value={startDate}
          onChange={setStartDate}
          placeholder="Select start date"
        />
        <DatePickerWithInput
          label="End date"
          value={endDate}
          onChange={setEndDate}
          placeholder="Select end date"
          disabledDates={(date) => {
            if (startDate) {
              return date < startDate;
            }
            return false;
          }}
        />
        {startDate && endDate && (
          <div className="p-4 bg-green-50 rounded-lg text-sm">
            <p className="font-semibold text-green-800 mb-1">Date range:</p>
            <p className="text-green-700">
              From {startDate.toLocaleDateString('en-US')} to{' '}
              {endDate.toLocaleDateString('en-US')}
            </p>
            <p className="text-green-600 mt-1">
              Total {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [error, setError] = useState('');

    const handleSubmit = () => {
      if (!date) {
        setError('Please select a date');
      } else {
        setError('');
        alert(`Selected: ${date.toLocaleDateString('en-US')}`);
      }
    };

    return (
      <div className="space-y-4 max-w-md">
        <DatePickerWithInput
          label="Appointment date *"
          value={date}
          onChange={(newDate) => {
            setDate(newDate);
            if (newDate) setError('');
          }}
          placeholder="Select appointment date"
          error={error}
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-500 transition-colors"
        >
          Confirm appointment
        </button>
      </div>
    );
  },
};

export const DifferentFormats: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="space-y-4">
        <DatePickerWithInput
          label="Full format (PPP)"
          value={date}
          onChange={setDate}
          dateFormat="PPP"
        />
        <DatePickerWithInput
          label="Short format (yyyy-MM-dd)"
          value={date}
          onChange={setDate}
          dateFormat="yyyy-MM-dd"
        />
        <DatePickerWithInput
          label="US format (MM/dd/yyyy)"
          value={date}
          onChange={setDate}
          dateFormat="MM/dd/yyyy"
        />
        <DatePickerWithInput
          label="With weekday (EEEE, PPP)"
          value={date}
          onChange={setDate}
          dateFormat="EEEE, PPP"
        />
      </div>
    );
  },
};
