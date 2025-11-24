'use client';

import * as React from 'react';
import { cn } from '../../utils';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TGDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
  fullWidth?: boolean;
}

export function TGDropdown({
  options,
  value,
  onChange,
  placeholder = 'Please select',
  disabled = false,
  className,
  error,
  label,
  fullWidth = true,
}: TGDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div className={cn('relative font-manrope', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 font-manrope">
          {label}
        </label>
      )}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between gap-2 font-manrope',
            'px-4 py-2.5 rounded-lg border border-gray-200',
            'bg-white text-sm text-left',
            'transition-colors',
            '!outline-0 focus:!outline-0 focus-visible:!outline-0',
            'hover:border-gray-200',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500',
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn('flex items-center gap-2 flex-1 min-w-0', selectedOption ? 'text-gray-400' : 'text-gray-200')}>
            {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
            <span className="truncate">{selectedOption?.label || placeholder}</span>
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 transition-transform flex-shrink-0 text-gray-300',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div
            className={cn(
              'absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg',
              'max-h-60 overflow-auto',
              'animate-in fade-in-0 zoom-in-95 duration-200'
            )}
            role="listbox"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
                className={cn(
                  'w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left font-manrope',
                  'text-gray-400',
                  'transition-colors',
                  'hover:bg-gray-50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  value === option.value && 'bg-gray-100'
                )}
                role="option"
                aria-selected={value === option.value}
              >
                <span className="flex items-center gap-2 flex-1 min-w-0">
                  {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                  <span className="truncate">{option.label}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
