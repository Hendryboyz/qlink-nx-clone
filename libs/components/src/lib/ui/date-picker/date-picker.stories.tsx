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
    placeholder: '選擇日期',
  },
};

export const WithLabel: Story = {
  args: {
    label: '出生日期',
    placeholder: '請選擇出生日期',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: '預設日期',
    value: new Date(),
  },
};

export const WithError: Story = {
  args: {
    label: '必填日期',
    placeholder: '請選擇日期',
    error: '此欄位為必填',
  },
};

export const Disabled: Story = {
  args: {
    label: '停用的日期選擇器',
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
          label="選擇日期"
          value={date}
          onChange={setDate}
          placeholder="請選擇日期"
        />
        <div className="text-sm text-gray-600">
          選中的日期: {date ? date.toLocaleDateString('zh-TW') : '(未選擇)'}
        </div>
        <button
          onClick={() => setDate(undefined)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          清除日期
        </button>
      </div>
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    // 禁用過去的日期
    const disablePastDates = (date: Date) => {
      return date < subDays(new Date(), 1);
    };

    return (
      <div className="space-y-4">
        <DatePickerWithInput
          label="選擇未來日期"
          value={date}
          onChange={setDate}
          placeholder="只能選擇今天或未來的日期"
          disabledDates={disablePastDates}
        />
        <p className="text-sm text-gray-600">
          過去的日期已被禁用
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
          label="開始日期"
          value={startDate}
          onChange={setStartDate}
          placeholder="選擇開始日期"
        />
        <DatePickerWithInput
          label="結束日期"
          value={endDate}
          onChange={setEndDate}
          placeholder="選擇結束日期"
          disabledDates={(date) => {
            if (startDate) {
              return date < startDate;
            }
            return false;
          }}
        />
        {startDate && endDate && (
          <div className="p-4 bg-green-50 rounded-lg text-sm">
            <p className="font-semibold text-green-800 mb-1">日期範圍:</p>
            <p className="text-green-700">
              從 {startDate.toLocaleDateString('zh-TW')} 到{' '}
              {endDate.toLocaleDateString('zh-TW')}
            </p>
            <p className="text-green-600 mt-1">
              共 {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} 天
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
        setError('請選擇日期');
      } else {
        setError('');
        alert(`已選擇: ${date.toLocaleDateString('zh-TW')}`);
      }
    };

    return (
      <div className="space-y-4 max-w-md">
        <DatePickerWithInput
          label="預約日期 *"
          value={date}
          onChange={(newDate) => {
            setDate(newDate);
            if (newDate) setError('');
          }}
          placeholder="請選擇預約日期"
          error={error}
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-500 transition-colors"
        >
          確認預約
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
          label="完整格式 (PPP)"
          value={date}
          onChange={setDate}
          dateFormat="PPP"
        />
        <DatePickerWithInput
          label="短格式 (yyyy-MM-dd)"
          value={date}
          onChange={setDate}
          dateFormat="yyyy-MM-dd"
        />
        <DatePickerWithInput
          label="台灣格式 (yyyy年MM月dd日)"
          value={date}
          onChange={setDate}
          dateFormat="yyyy年MM月dd日"
        />
        <DatePickerWithInput
          label="含星期 (EEEE, PPP)"
          value={date}
          onChange={setDate}
          dateFormat="EEEE, PPP"
        />
      </div>
    );
  },
};
