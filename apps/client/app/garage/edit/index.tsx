'use client';

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Header from '$/components/Header';
import * as Yup from 'yup';
import { ErrorMessage, Field, Formik } from 'formik';
import API from '$/utils/fetch';
import { IconButton } from '@radix-ui/themes';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import {
  ModelVO,
  ProductRemoveDto,
  ProductUpdateDto,
  ProductVO,
  UpdateProductData,
} from '@org/types';
import { usePopup } from '$/hooks/PopupProvider';
import { DEFAULT_ERROR_MSG } from '@org/common';
import DropdownField from '$/components/Dropdown';
import DateField from '$/components/Fields/DateField';
import Button from '$/components/Button';
import { DEFAULT_MODELS } from '$/utils';

const CreateSchema = Yup.object().shape({
  id: Yup.string().required('Required'),
  model: Yup.string().required('Required'),
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
});
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
  const DEFAULT_ERROR_MSG_CLASS =
    'text-red-500 absolute top-0 right-0 text-xs text-right pl-3';
  const POPUP_BUTTON_STYLE = 'py-2 px-3 text-sm rounded-lg h-[30px] font-[GilroySemiBold]';
  const [models, setModels] = useState<ModelVO[]>([]);
  const [editKey, setEditKey] = useState<KEY | null>(null);
  const [editValue, setEditValue] = useState<string | number>('');
  const inputRefs = useRef<{
    [key in KEY]: React.RefObject<HTMLInputElement>;
  }>({} as { [key in KEY]: React.RefObject<HTMLInputElement> });

  const valueBeforeEditRef = useRef<string | number>('');
  const [initValue, setInitValue] = useState<FormData>({
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
  useEffect(() => {
    (Object.keys(ATTRS) as Array<keyof typeof ATTRS>).forEach((key) => {
      if (ATTRS[key].editable && ATTRS[key].type != 'date') {
        inputRefs.current[key] = React.createRef<HTMLInputElement>();
      }
    });
  }, []);
  useEffect(() => {
    if (editKey) {
      inputRefs.current[editKey]?.current?.focus();
    }
  }, [editKey]);
  const removeAction = useCallback(() => {
    hidePopup();
    API.delete('/product/remove', {
      data: { id: initValue.id } as ProductRemoveDto,
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
  }, [initValue])

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
    <div className="w-full  min-h-full flex-1">
      <Formik
        initialValues={initValue}
        validationSchema={CreateSchema}
        onSubmit={(values, { setSubmitting, setFieldValue }) => {
          if (!editKey) return;
          const data: UpdateProductData = {};
          // @ts-expect-error F*CK
          data[editKey] = editValue;
          API.put('/product/save', {
            id: values.id,
            data,
          } as ProductUpdateDto)
            .then((res) => {
              setInitValue((pre) => ({
                ...pre,
                [editKey]: editValue,
              }));
              setFieldValue(editKey, editValue);
            })
            .catch((err) => {
              showPopup({ title: DEFAULT_ERROR_MSG });
              setFieldValue(editKey, initValue[editKey]);
              console.error(err);
            })
            .finally(() => {
              setEditKey(null);
              setEditValue('');
            });
        }}
      >
        {({ values, isSubmitting, setFieldValue, handleSubmit, errors }) => (
          <Fragment>
            <Header
              title="Edit Product"
              useBackBtn={true}
              customBackAction={onCancel}
            />
            <div>
              {(Object.entries(ATTRS) as [KEY, Columns[KEY]][]).map(
                ([key, formData]) => {
                  const isValueChanged =
                    valueBeforeEditRef.current !== editValue;
                  return (
                    <div
                      className="flex items-center py-3 mx-6 border-b-2 border-gray-100"
                      key={key}
                    >
                      <div className="flex flex-col w-full text-gray-400 relative ">
                        <span className="text-xs mb-1 text-[#D70127]">{formData.title}</span>
                        {formData.type == 'select' && formData.editable ? (
                          <DropdownField
                            id={key}
                            name={key}
                            placeholder=" "
                            options={models.map((vo) => ({
                              value: vo.id,
                              label: vo.title,
                            }))}
                            label={formData.title}
                          />
                        ) : (
                          <div className="flex items-center justify-between">
                                                                                                                   {formData.type === 'date' && editKey === key ? (
                               <DateField
                                 name={key}
                                 defaultDisplayValue="0000-00-00"
                                 className="text-base"
                                 autoOpen={true}
                               />
                             ) : formData.type === 'date' ? (
                               <div className="bg-white text-base" style={{ textAlign: 'left' }}>
                                 {getDisplayValue(key, initValue[key])}
                               </div>
                             ) : (
                               <Field
                                 innerRef={inputRefs.current[key]}
                                 id={key}
                                 name={key}
                                 type={formData.type || 'text'}
                                 placeholder=""
                                 className="bg-white text-base"
                                 value={editKey === key ? editValue : getDisplayValue(key, initValue[key])}
                                 onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                   setFieldValue(key, initValue[key]);
                                   setEditKey(null);
                                   setEditValue('');
                                 }}
                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                   const value = e.target.value;
                                   setFieldValue(key, value);
                                   setEditValue(value);
                                 }}
                                 readOnly={!formData.editable || editKey != key}
                               />
                             )}
                            {editKey === key && isValueChanged ? (
                              <div className="flex gap-1">
                                <IconButton
                                  color="blue"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    handleSubmit();
                                  }}
                                >
                                  <CheckIcon height={18} width={18} />
                                </IconButton>
                                <IconButton
                                  color="blue"
                                  onClick={() => {
                                    setEditKey(null);
                                  }}
                                >
                                  <Cross2Icon height={18} width={18} />
                                </IconButton>
                              </div>
                            ) : (
                              formData.editable && (
                                <img
                                  src="/assets/edit_pencil.svg"
                                  alt="edit"
                                  onClick={() => {
                                    setEditKey(key);
                                    setEditValue(values[key]);
                                    valueBeforeEditRef.current = values[key];
                                  }}
                                />
                              )
                            )}
                          </div>
                        )}
                        <ErrorMessage
                          name={key}
                          className={DEFAULT_ERROR_MSG_CLASS}
                          component="span"
                        />
                      </div>
                    </div>
                  );
                }
              )}
              <div
                className="flex items-center w-full justify-center mt-9 hover:cursor-pointer"
                onClick={() => handleRemove()}
              >
                <span className="text-primary-500 font-bold mr-2">
                  Don&apos;t own the bike anymore?
                </span>
                <img
                  alt="remove"
                  src="/assets/trash.png"
                />
              </div>
            </div>
          </Fragment>
        )}
      </Formik>
    </div>
  );
}
