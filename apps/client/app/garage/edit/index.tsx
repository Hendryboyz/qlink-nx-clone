'use client';

import React, { Fragment, useCallback, useEffect, useState, useRef } from 'react';
import Header from '$/components/Header';
import * as Yup from 'yup';
import API from '$/utils/fetch';
import {
  ModelVO,
  ProductRemoveDto,
  ProductUpdateDto,
  ProductVO,
  UpdateProductData,
} from '@org/types';
import { usePopup } from '$/hooks/PopupProvider';
import { DEFAULT_ERROR_MSG } from '@org/common';
import Editable from '$/components/Fields/Editable';
import Button from '$/components/Button';
import { DEFAULT_MODELS } from '$/utils';
import { IconButton } from '@radix-ui/themes';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';

// Validation schemas for individual fields
const validationSchemas = {
  year: Yup.number().required('Required').max(9999).typeError('Required'),
  vin: Yup.string().required('Required'),
  dealerName: Yup.string().required('Required'),
  engineNumber: Yup.string().required('Required'),
  purchaseDate: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .required('YYYY-MM-DD'),
  registrationDate: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .required('YYYY-MM-DD'),
};
interface FormData {
  id: string;
  model: string;
  year: number;
  vin: string;
  dealerName?: string;
  engineNumber: string;
  purchaseDate: string;
  registrationDate: string;
}
type KEY = keyof FormData;
type Columns = {
  [k in KEY]: {
    title: string;
    type?: string;
    editable?: boolean;
  };
};

const ATTRS: Columns = {
  id: {
    title: 'Registration ID',
  },
  model: {
    title: 'Model',
    type: 'select',
  },
  year: {
    title: 'Year',
    type: 'number',
    editable: true,
  },
  vin: {
    title: 'VIN No.',
    editable: true,
  },
  engineNumber: {
    title: 'Engine Serial No.',
    editable: true,
  },
  purchaseDate: {
    title: 'Purchase Date',
    type: 'date',
    editable: true,
  },
  registrationDate: {
    title: 'Registration Date',
    type: 'date',
    editable: true,
  },
  dealerName: {
    title: 'Dealer Name',
    editable: true,
  },
};
type Props = {
  data: ProductVO;
  onCancel: () => void;
  onRemove: () => void;
};

const EDITABLE_MIN_HEIGHT = '3.375rem';

const ModelDropdown = React.forwardRef<
  { handleSave: () => void; handleCancel: () => void },
  {
    value?: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    isEditing: boolean;
    onSave: () => void;
    onCancel: () => void;
  }
>(({ value, options, onChange, isEditing, onSave, onCancel }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const displayValue = React.useMemo(() => {
    if (!currentValue) return 'None';
    const selectedOption = options.find(opt => opt.value === currentValue);
    return selectedOption ? selectedOption.label : currentValue;
  }, [currentValue, options]);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = () => {
    if (currentValue && currentValue !== value) {
      onChange(currentValue);
    }
    onSave();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    onCancel();
    setIsOpen(false);
  };

  React.useImperativeHandle(ref, () => ({
    handleSave,
    handleCancel
  }));

  if (!isEditing) {
    return (
      <div className="h-6 flex items-center">
        <span className="font-[GilroySemiBold] text-[1rem]">
          {displayValue}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-48 sm:w-56 md:w-64">
      <div
        className="w-full mr-1 text-[1rem] font-[GilroySemiBold] h-6 py-0 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!currentValue ? 'text-gray-400' : ''}>
          {displayValue}
        </span>
        <img
          src="/assets/chevron_down.svg"
          className="flex-shrink-0 ml-2"
          alt="dropdown arrow"
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-max whitespace-nowrap mt-1">
            {options.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                onClick={() => {
                  setCurrentValue(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

export default function GarageEdit({ data, onCancel, onRemove }: Props) {
  const POPUP_BUTTON_STYLE = 'py-2 px-3 text-sm rounded-lg h-[30px] font-[GilroySemiBold]';
  const [models, setModels] = useState<ModelVO[]>([]);
  const [productData, setProductData] = useState<FormData>({
    id: data.id,
    model: data.model,
    year: data.year,
    vin: data.vin,
    engineNumber: data.engineNumber,
    purchaseDate: data.purchaseDate,
    registrationDate: data.registrationDate,
    dealerName: data.dealerName,
  });
  const { showPopup, hidePopup } = usePopup();
  const [isModelEditing, setIsModelEditing] = useState(false);
  const modelDropdownRef = useRef<{ handleSave: () => void; handleCancel: () => void }>(null);

  // Save change function for Editable components
  const saveChange = useCallback(async (editingKey: string, savingValue: any) => {
    if (!editingKey) return;

    const updateData: UpdateProductData = {};
    updateData[editingKey as keyof UpdateProductData] = savingValue;

    try {
      await API.put('/product/save', {
        id: productData.id,
        data: updateData,
      } as ProductUpdateDto);

      // Update local state
      setProductData(prev => ({
        ...prev,
        [editingKey]: savingValue,
      }));
    } catch (err) {
      showPopup({ title: DEFAULT_ERROR_MSG });
      console.error(err);
    }
  }, [productData.id, showPopup]);

  // 加入函數來轉換 model id 為 title
  const getDisplayValue = (key: KEY, value: any) => {
    if (key === 'model' && value) {
      const modelFound = DEFAULT_MODELS.find(m => m.id.toString() === value.toString());
      return modelFound ? modelFound.title : value;
    }
    return value;
  };

  useEffect(() => {
    //TODO: fetch model list
    setModels(DEFAULT_MODELS);
  }, []);
  const removeAction = useCallback(() => {
    hidePopup();
    API.delete('/product/remove', {
      data: { id: productData.id } as ProductRemoveDto,
    })
      .then(() => {
        showPopup({
          useDefault: true,
          title: 'Product has been removed',
        });
        onRemove();
      })
      .catch((err) => {
        showPopup({ title: DEFAULT_ERROR_MSG });
      });
  }, [productData.id, hidePopup, showPopup, onRemove])

  const handleRemove = () => {
    showPopup({
      useDefault: false,
      title: 'Remove from your account?',
      content: (<div className='flex items-center justify-center gap-4 w-full'>
        <Button
          className={POPUP_BUTTON_STYLE}
          style={{ width: '100px' }}
          onClick={hidePopup}
        >
          Cancel
        </Button>
        <Button
          className={POPUP_BUTTON_STYLE}
          style={{ width: '100px' }}
          onClick={removeAction}
        >
          Yes
        </Button>
      </div>)
    });
  };

  return (
    <div className="w-full min-h-full flex-1">
      <Header
        title="Edit Product"
        useBackBtn={true}
        customBackAction={onCancel}
      />
      <div className="md:px-36">
        <div className="mt-3 pl-1">
          <Editable
            key="id"
            editKey="id"
            title="Registration ID"
            className={`min-h-[${EDITABLE_MIN_HEIGHT}]`}
            defaultValue={productData.id}
            isChangeAllowed={false}
          />
          <div className={`flex justify-between items-start min-h-[${EDITABLE_MIN_HEIGHT}] pl-[1.25rem] pr-[1.25rem] border-b-inset-6`}>
            <div className="flex flex-col text-gray-400 relative pt-2">
              <span className="text-xs font-gilroy-regular text-[12px] text-[#D70127]">Model</span>
              <div className="min-h-[1.5rem] flex flex-col justify-start">
                <div className="min-h-[1rem]">
                  <ModelDropdown
                    ref={modelDropdownRef}
                    value={String(productData.model)}
                    options={models.map((vo) => ({
                      value: String(vo.id),
                      label: vo.title,
                    }))}
                    onChange={(value) => saveChange('model', value)}
                    isEditing={isModelEditing}
                    onSave={() => setIsModelEditing(false)}
                    onCancel={() => setIsModelEditing(false)}
                  />
                </div>
              </div>
            </div>
            <div className="pt-4">
              {isModelEditing ? (
                <div className="flex gap-1">
                  <IconButton
                    className="icon-button-small"
                    color="blue"
                    onClick={() => modelDropdownRef.current?.handleSave()}
                  >
                    <CheckIcon height={16} width={16} />
                  </IconButton>
                  <IconButton
                    className="icon-button-small"
                    color="blue"
                    onClick={() => modelDropdownRef.current?.handleCancel()}
                  >
                    <Cross2Icon height={16} width={16} />
                  </IconButton>
                </div>
              ) : (
                <img
                  src="/assets/edit_pencil.svg"
                  alt="edit"
                  className="cursor-pointer"
                  onClick={() => setIsModelEditing(true)}
                />
              )}
            </div>
          </div>
          <Editable
            key="year"
            editKey="year"
            title="Year"
            type="text"
            className="min-h-[3.375rem]"
            defaultValue={productData.year?.toString()}
            saveChange={saveChange}
            validation={validationSchemas.year}
            isChangeAllowed={true}
          />
          <Editable
            key="vin"
            editKey="vin"
            title="VIN No."
            className={`min-h-[${EDITABLE_MIN_HEIGHT}]`}
            defaultValue={productData.vin}
            saveChange={saveChange}
            validation={validationSchemas.vin}
            isChangeAllowed={true}
          />
          <Editable
            key="engineNumber"
            editKey="engineNumber"
            title="Engine Serial No."
            className="min-h-[3.375rem]"
            defaultValue={productData.engineNumber}
            saveChange={saveChange}
            validation={validationSchemas.engineNumber}
            isChangeAllowed={true}
          />
          <Editable
            key="purchaseDate"
            editKey="purchaseDate"
            title="Purchase Date"
            type="date"
            className={`min-h-[${EDITABLE_MIN_HEIGHT}]`}
            defaultValue={productData.purchaseDate}
            saveChange={saveChange}
            validation={validationSchemas.purchaseDate}
            isChangeAllowed={true}
          />
          <Editable
            key="registrationDate"
            editKey="registrationDate"
            title="Registration Date"
            type="date"
            className="min-h-[3.375rem]"
            defaultValue={productData.registrationDate}
            saveChange={saveChange}
            validation={validationSchemas.registrationDate}
            isChangeAllowed={true}
          />
          <Editable
            key="dealerName"
            editKey="dealerName"
            title="Dealer Name"
            className={`min-h-[${EDITABLE_MIN_HEIGHT}]`}
            defaultValue={productData.dealerName}
            saveChange={saveChange}
            validation={validationSchemas.dealerName}
            isChangeAllowed={true}
          />
        </div>
        <div
          className="flex items-center w-full justify-center mt-6 hover:cursor-pointer"
          onClick={() => handleRemove()}
        >
          <span className="text-primary-500 text-sm font-[GilroyBold] mr-2 leading-none">
            Don&apos;t own the bike anymore?
          </span>
          <img
            alt="remove"
            src="/assets/trash.svg"
            className="mb-[5px]"
          />
        </div>
      </div>
    </div>
  );
}
