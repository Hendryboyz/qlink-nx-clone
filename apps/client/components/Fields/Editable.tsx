import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { IconButton, Select } from '@radix-ui/themes';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { fromDate } from '@org/common';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Option = {
  value: string | number,
  label?: string
}

type EditableProps = {
  editKey: string;
  title: string;
  type?: "text" | "date" | "dropdown";
  defaultValue?: string;
  validation?: Yup.Schema;
  isChangeAllowed: boolean;
  options?: Option[];
  saveChange?: (editingKey: string, savingValue: any) => void;
}

export default function Editable({editKey, title, type = 'text', defaultValue, validation, isChangeAllowed, options, saveChange }: EditableProps) {
  if (type === 'date' && defaultValue) {
    defaultValue = fromDate(new Date(defaultValue));
  }

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const [currentCursor, setCursor] = useState([defaultValue ? defaultValue.length : null, defaultValue ? defaultValue.length : null]);

  const inputRef = useRef<HTMLInputElement>(null);

  // focus input while editing
  useEffect(() => {
    if (!inputRef || !inputRef.current || !isEditing || type === 'date') {
      return;
    }
    inputRef.current?.focus?.();
    const [start, end] = currentCursor;
    inputRef.current?.setSelectionRange(start, end);
  }, [isEditing, inputRef, currentValue, error, type]);


  const showEditButton = () => {
    if (isEditing) {
      return (
        <div className="flex gap-1">
          <IconButton
            className="icon-button-small"
            color="blue"
            disabled={error !== ''}
            onClick={() => {
            if (saveChange && isChangeAllowed) {
              saveChange(editKey, currentValue);
            }
            setIsEditing(wasEditing => !wasEditing);
          }}>
            <CheckIcon height={16} width={16} />
          </IconButton>
          <IconButton
            className="icon-button-small"
            color="blue"
            onClick={() => {
              setCurrentValue(defaultValue);
              setError('');
              setIsEditing(wasEditing => !wasEditing);
            }}
          >
            <Cross2Icon height={16} width={16} />
          </IconButton>
        </div>
      );
    } else {
      return (
        <img
          src="/assets/edit_pencil.svg"
          alt="edit"
          onClick={() => { setIsEditing(wasEditing => !wasEditing); }}
        />
      );
    }
  };

  const handleInputChange =  async (
    e: ChangeEvent<HTMLInputElement>, defaultValidation?: Yup.Schema) => {
    try {
      if (validation) await validation.validate(e.target.value);
      if (defaultValidation) await defaultValidation.validate(e.target.value);
      setError('');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.message);
      }
    } finally {
      setCurrentValue(e.target.value);
      setCursor([e.target.selectionStart, e.target.selectionEnd]);
    }
  };


  const Input = ({ ...props }) => {
    if (type === 'text') {
      return (
        <input
          ref={inputRef}
          defaultValue={currentValue}
          type="text"
          onChange={async (e) => {
            await handleInputChange(e);
          }}
          {...props}
        />
      );
    } else if (type === 'dropdown') {
      return (
        <Select.Root
          value={currentValue ? String(currentValue) : undefined}
          onValueChange={(value) => setCurrentValue(value)}
          size="1"
        >
          <Select.Trigger className="min-w-60 mr-1 text-[1rem] font-semibold h-6 py-0 border-none shadow-none bg-transparent" {...props} />
          <Select.Content className="max-h-60">
            {options && options.map(({ value, label }) => (
              <Select.Item key={value} value={String(value)}>
                {label ? label : value}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      );
    } else if (type === 'date') {
      const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
      const [isManualInput, setIsManualInput] = useState(false);
      const [manualInputValue, setManualInputValue] = useState('');

      // Auto-open DatePicker when entering edit mode
      useEffect(() => {
        if (isEditing && type === 'date') {
          setIsDatePickerOpen(true);
          setIsManualInput(false);
        }
      }, [isEditing, type]);

      const dateValue = currentValue && currentValue !== '0000-00-00'
        ? new Date(currentValue)
        : null;

      const handleDateChange = (date: Date | null) => {
        if (date) {
          const formattedDate = date.toISOString().split('T')[0];
          setCurrentValue(formattedDate);
        } else {
          setCurrentValue('0000-00-00');
        }
        setIsDatePickerOpen(false);
        setIsEditing(false);
      };

      const handleManualInputSubmit = () => {
        const dateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
        const match = manualInputValue.match(dateRegex);

        if (match) {
          const [, year, month, day] = match;
          const paddedMonth = month.padStart(2, '0');
          const paddedDay = day.padStart(2, '0');
          const formattedDate = `${year}-${paddedMonth}-${paddedDay}`;

          const testDate = new Date(formattedDate);
          if (testDate.getFullYear() == parseInt(year) &&
              testDate.getMonth() == parseInt(paddedMonth) - 1 &&
              testDate.getDate() == parseInt(paddedDay)) {
            setCurrentValue(formattedDate);
            setError('');
          } else {
            setError('Invalid date');
          }
        } else if (manualInputValue.trim() === '') {
          setCurrentValue('0000-00-00');
          setError('');
        } else {
          setError('Date must be in YYYY-MM-DD format');
        }

        setIsManualInput(false);
        setManualInputValue('');
        setIsEditing(false);
      };

      const displayValue = currentValue && currentValue !== '0000-00-00'
        ? currentValue
        : '0000-00-00';

      return (
        <div className="relative">
          {isManualInput ? (
            <input
              ref={inputRef}
              type="text"
              value={manualInputValue}
              onChange={(e) => setManualInputValue(e.target.value)}
              onBlur={handleManualInputSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleManualInputSubmit();
                if (e.key === 'Escape') {
                  setIsManualInput(false);
                  setManualInputValue('');
                  setIsEditing(false);
                }
              }}
              className="min-w-60 mr-1 text-[1rem] font-semibold h-6 py-0 outline-none focus:ring-0 focus:border-gray-300 border-none bg-transparent"
              placeholder="YYYY-MM-DD"
              {...props}
            />
          ) : (
            <div
              className="min-w-60 mr-1 text-[1rem] font-semibold h-6 py-0 cursor-pointer flex items-center"
              onClick={() => setIsDatePickerOpen(true)}
              onDoubleClick={() => {
                setIsManualInput(true);
                setManualInputValue(currentValue && currentValue !== '0000-00-00' ? currentValue : '');
                setIsDatePickerOpen(false);
              }}
            >
              {displayValue}
            </div>
          )}

          {isDatePickerOpen && !isManualInput && (
            <div className="absolute top-6 left-0 z-50">
              <DatePicker
                selected={dateValue}
                onChange={handleDateChange}
                onClickOutside={() => {
                  setIsDatePickerOpen(false);
                  setIsEditing(false);
                }}
                dateFormat="yyyy-MM-dd"
                open={true}
                inline={false}
                popperPlacement="bottom-start"
                className="hidden"
                calendarClassName="shadow-lg border rounded-lg"
              />
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="flex justify-between items-center min-h-[3.1875rem] pl-[1.25rem] pr-[1.25rem] border-b-inset-6">
      <div className="flex flex-col text-gray-400">
        <span className="text-xs font-gilroy-regular text-[12px] text-[#D70127]">{title}</span>
        <div className="h-auto min-h-4 flex flex-col content-around -mt-1">
          {isEditing ? (
            <>
              <Input className="min-w-60 mr-1 text-lg h-6 py-0 outline-none focus:ring-0 focus:border-gray-300" />
              {error && <span className="text-red-600">{error}</span>}
            </>
          ) : (
            <span className="font-[GilroySemiBold] text-[1rem] min-h-[1rem] inline-block">
              {type === 'dropdown' && options && currentValue
                ? options.find(opt => String(opt.value) === String(currentValue))?.label || currentValue
                : currentValue || '\u00A0'}
            </span>
          )}
        </div>
      </div>
      {isChangeAllowed && showEditButton() }
    </div>
  );
}
