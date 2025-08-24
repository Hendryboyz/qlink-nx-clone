import React, { useState, useRef, useEffect } from 'react';
import { useField } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateFieldProps {
  name: string;
  placeholder?: string;
  className?: string;
  defaultDisplayValue?: string;
  autoOpen?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({
  name,
  placeholder = "0000-00-00",
  className = "",
  defaultDisplayValue = "0000-00-00",
  autoOpen = false,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert string to Date object or null
  const dateValue = field.value && field.value !== '0000-00-00'
    ? new Date(field.value)
    : null;

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      helpers.setValue(formattedDate);
    } else {
      helpers.setValue('0000-00-00');
    }
    setIsOpen(false);
  };

  const handleKeyboardInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue('');
    }
  };

  const handleInputSubmit = () => {
    // Validate date format (YYYY-MM-DD or variations)
    const dateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
    const match = inputValue.match(dateRegex);

    if (match) {
      const [, year, month, day] = match;
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');
      const formattedDate = `${year}-${paddedMonth}-${paddedDay}`;

      // Validate if it's a real date
      const testDate = new Date(formattedDate);
      if (testDate.getFullYear() == parseInt(year) &&
          testDate.getMonth() == parseInt(paddedMonth) - 1 &&
          testDate.getDate() == parseInt(paddedDay)) {
        helpers.setValue(formattedDate);
      } else {
        // Invalid date, keep original value
        alert('Invalid date format. Please use YYYY-MM-DD');
      }
    } else if (inputValue.trim() === '') {
      helpers.setValue('0000-00-00');
    } else {
      alert('Invalid date format. Please use YYYY-MM-DD');
    }

    setIsEditing(false);
    setInputValue('');
  };

  const displayValue = field.value && field.value !== '0000-00-00'
    ? field.value
    : defaultDisplayValue;

  const handleClick = () => {
    if (isEditing) return;
    setIsOpen(true);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setInputValue(field.value && field.value !== '0000-00-00' ? field.value : '');
    setIsOpen(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  return (
    <div className="relative">
            {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputSubmit}
          onKeyDown={handleKeyboardInput}
          className={`border-none outline-none bg-transparent w-full ${className}`}
          placeholder="YYYY-MM-DD"
          style={{ textAlign: 'left' }}
        />
      ) : (
        /* Custom display div */
        <div
          className={`cursor-pointer w-full min-h-[48px] flex items-center ${
            field.value && field.value !== '0000-00-00'
              ? className
              : className.includes('bg-white')
                ? className.replace(/text-\w+-\d+/g, 'text-gray-400').replace(/font-\w+/g, 'font-normal')
                : 'text-base pl-0 text-gray-400 font-[GilroyRegular]'
          }`}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          style={{ textAlign: 'left' }}
        >
          {displayValue}
        </div>
      )}

      {/* Hidden DatePicker */}
      {isOpen && !isEditing && (
        <div className="absolute top-0 left-0 z-50">
          <DatePicker
            selected={dateValue}
            onChange={handleDateChange}
            onClickOutside={() => setIsOpen(false)}
            dateFormat="yyyy-MM-dd"
            placeholderText={placeholder}
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
};

export default DateField;