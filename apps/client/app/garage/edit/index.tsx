'use client';

import React, { Fragment, useCallback, useEffect, useState } from 'react';
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
  dealerName: string;
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

  // Save change function for Editable components
  const saveChange = useCallback(async (editingKey: string, savingValue: any) => {
    if (!editingKey) return;

    const updateData: UpdateProductData = {};
    // @ts-expect-error Type assertion for dynamic key
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
        <div className="mt-4 pl-1">
          <Editable
            key="id"
            editKey="id"
            title="Registration ID"
            defaultValue={productData.id}
            isChangeAllowed={false}
          />
          <Editable
            key="model"
            editKey="model"
            title="Model"
            type="dropdown"
            defaultValue={String(productData.model)}
            saveChange={saveChange}
            isChangeAllowed={true}
            options={models.map((vo) => ({
              value: String(vo.id),
              label: vo.title,
            }))}
          />
          <Editable
            key="year"
            editKey="year"
            title="Year"
            type="text"
            defaultValue={productData.year?.toString()}
            saveChange={saveChange}
            validation={validationSchemas.year}
            isChangeAllowed={true}
          />
          <Editable
            key="vin"
            editKey="vin"
            title="VIN No."
            defaultValue={productData.vin}
            saveChange={saveChange}
            validation={validationSchemas.vin}
            isChangeAllowed={true}
          />
          <Editable
            key="engineNumber"
            editKey="engineNumber"
            title="Engine Serial No."
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
            defaultValue={productData.registrationDate}
            saveChange={saveChange}
            validation={validationSchemas.registrationDate}
            isChangeAllowed={true}
          />
          <Editable
            key="dealerName"
            editKey="dealerName"
            title="Dealer Name"
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
