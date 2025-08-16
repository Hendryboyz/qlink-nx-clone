import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { IconButton } from '@radix-ui/themes';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { fromDate } from '@org/common';

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
    if (!inputRef || !inputRef.current || !isEditing) {
      return;
    }
    inputRef.current?.focus?.();
    const [start, end] = currentCursor;
    inputRef.current?.setSelectionRange(start, end);
  }, [isEditing, inputRef, currentValue, error]);


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
        <select
          defaultValue={currentValue}
          onChange={
          (e) => {
            setCurrentValue(e.target.value);
          }}
          {...props}
        >
          {options && options.map(({ value, label }) => (
            <option key={value} value={value}>{ label ? label : value }</option>
          ))}
        </select>
      );
    } else if (type === 'date') {
      return (
        <input
          ref={inputRef}
          defaultValue={currentValue}
          type="text"
          onChange={async (e) => {
            await handleInputChange(
              e,
              Yup.string()
                .matches(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format.')
                .nullable(),
            );
          }}
          {...props}
        />
      );
    }
  };

  return (
    <div className="flex justify-between items-center min-h-[3.1875rem] pl-6 pr-6 border-b-inset-6">
      <div className="flex flex-col text-gray-400">
        <span className="text-xs font-gilroy-regular text-[12px] text-[#D70127]">{title}</span>
        <div className="h-auto min-h-4 flex flex-col content-around -mt-1">
          {isEditing ? (
            <>
              <Input className="min-w-60 mr-1 text-lg h-6 py-0 outline-none focus:ring-0 focus:border-gray-300" />
              {error && <span className="text-red-600">{error}</span>}
            </>
          ) : (
            <span className="font-semibold text-[1rem]">{currentValue}</span>
          )}
        </div>
      </div>
      {isChangeAllowed && showEditButton() }
    </div>
  );
}
