'use client';

import React, { Fragment, useEffect, useState } from 'react';
import Header from '$/components/Header';
import * as Yup from 'yup';
import { ErrorMessage, Field, Formik } from 'formik';
import API from '$/utils/fetch';
import { ModelVO, ProductDto } from '@org/types';
import { useRouter } from 'next/navigation';
import { usePopup } from '$/hooks/PopupProvider';
import { DEFAULT_ERROR_MSG } from '@org/common';
import DateField from '$/components/Fields/DateField';
import Button from '$/components/Button';
import { DEFAULT_MODELS } from '$/utils';
const CreateSchema = Yup.object().shape({
  model: Yup.string().required('Required'),
  year: Yup.number().required('Required').typeError("Required"),
  vin: Yup.string().required('Required'),
  dealerName: Yup.string(),
  engineNumber: Yup.string().required('Required'),
  purchaseDate: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .required('YYYY-MM-DD'),
  registrationDate: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .required('YYYY-MM-DD'),
});
interface FormData {
  model: string;
  year: number | string;
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
    placeholder?: string;
  };
};
const defaultValue: FormData = {
  model: '',
  year: '',
  vin: '',
  dealerName: '',
  engineNumber: '',
  purchaseDate: '0000-00-00',
  registrationDate: new Date().toISOString().split('T')[0],
};
const ATTRS: Columns = {
  model: {
    title: 'Model',
    type: 'select',
    placeholder: 'Please select a model',
  },
  year: {
    title: 'Year',
    type: 'number',
    placeholder: 'Enter year (e.g. 2024)',
  },
  vin: {
    title: 'VIN No.',
    placeholder: 'Enter VIN number',
  },
  engineNumber: {
    title: 'Engine Serial No.',
    placeholder: 'Enter engine serial number',
  },
  purchaseDate: {
    title: 'Purchase Date',
    type: 'date',
    placeholder: 'Select purchase date'
  },
  registrationDate: {
    title: 'Registration Date',
    type: 'date',
    placeholder: 'Select registration date'
  },
  dealerName: {
    title: 'Dealer Name',
    placeholder: 'Enter dealer name',
  },
};
export default function GarageAdd() {
  const DEFAULT_ERROR_MSG_CLASS = 'text-red-500 text-xs block -mt-[0.25rem] mb-[0.5rem]';
  const POPUP_BUTTON_STYLE = 'py-2 px-3 text-sm rounded-lg h-[30px] font-[GilroySemiBold]';
  const [models, setModels] = useState<ModelVO[]>([]);
  const initValue: FormData = defaultValue;
  const router = useRouter();
  const { showPopup, hidePopup } = usePopup();
  useEffect(() => {
    //TODO: fetch model list
    setModels(DEFAULT_MODELS);
  }, []);
  return (
    <div className="w-full  min-h-full flex-1">
      <Formik
        initialValues={initValue}
        validationSchema={CreateSchema}
        onSubmit={(values, { setSubmitting }) => {
          API.post('/product/save', {
            vin: values.vin,
            engineNumber: values.engineNumber,
            purchaseDate: values.purchaseDate,
            registrationDate: values.registrationDate,
            dealerName: values.dealerName,
            year: values.year,
            model: values.model,
          } as ProductDto)
            .then((_) => {
              showPopup({
                useDefault: false,
                title: 'Your product registration has been submitted.',
                content: (
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      className={POPUP_BUTTON_STYLE}
                      style={{ width: '100px' }}
                      onClick={() => {
                        router.push('/garage');
                        hidePopup();
                      }}
                    >
                      Garage
                    </Button>
                    <Button
                      className={POPUP_BUTTON_STYLE}
                      style={{ width: '100px' }}
                      onClick={() => {
                        router.push('/');
                        hidePopup();
                      }}
                    >
                      Home
                    </Button>
                  </div>
                )
              })
            })
            .catch((err) => {
              showPopup({ title: DEFAULT_ERROR_MSG });
              console.error(err);
            });
        }}
      >
        {({ values, isSubmitting, setFieldValue, handleSubmit, errors }) => (
          <Fragment>
            <Header
              title="Register Product"
              useBackBtn={true}
              customBtn={
                <img
                  src="/assets/save.svg"
                  onClick={() => handleSubmit()}
                />
              }
              customBackAction={() => { router.push('/garage'); }}
            />
            <div className="md:px-36">
              <div className="mt-4 pl-1">
                {(Object.entries(ATTRS) as [KEY, Columns[KEY]][]).map(
                ([key, data]) => {
                  return (
                    <div
                      className="flex justify-between items-start min-h-[3.375rem] pl-[1.25rem] pr-[1.25rem] border-b-inset-6"
                      key={key}
                    >
                      <div className="flex flex-col text-gray-400 flex-1">
                        <div className="h-[3.375rem] flex flex-col justify-center">
                          <span className="text-xs font-gilroy-regular text-[12px] text-[#D70127]">{data.title}</span>
                          <div className="h-auto flex flex-col mt-[2px]">
                        {data.type == 'select' ? (
                          <Field name={key}>
                            {({ field, form }: any) => {
                              const [isOpen, setIsOpen] = useState(false);
                              const selectedModel = models.find(m => String(m.id) === String(field.value));
                              const displayValue = selectedModel ? selectedModel.title : (data.placeholder || 'X');

                              return (
                                <div className="relative">
                                  <div
                                    className="flex justify-between items-center cursor-pointer w-full"
                                    onClick={() => setIsOpen(!isOpen)}
                                  >
                                    <span
                                      className={`text-base ${selectedModel ? 'font-[GilroySemiBold] text-gray-500' : 'font-[GilroySemiBold] text-gray-400'}`}
                                      style={{
                                        display: 'inline-block',
                                        minHeight: '1rem'
                                      }}
                                    >
                                      {displayValue}
                                    </span>
                                    <img
                                      src="/assets/chevron_down.svg"
                                      className="flex-shrink-0"
                                      alt="dropdown arrow"
                                    />
                                  </div>

                                  {isOpen && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsOpen(false)}
                                      />
                                      <div className="absolute top-6 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-max whitespace-nowrap">
                                        {models.map((vo) => (
                                          <div
                                            key={vo.id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                                            onClick={() => {
                                              form.setFieldValue(key, String(vo.id));
                                              setIsOpen(false);
                                            }}
                                          >
                                            {vo.title}
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            }}
                          </Field>
                        ) : data.type === 'date' ? (
                          <div className="garage-date-field">
                            <DateField
                              name={key}
                              defaultDisplayValue={data.placeholder || "0000-00-00"}
                              placeholder={data.placeholder}
                              className="text-base pl-0 font-[GilroySemiBold] text-gray-500"
                              placeholderClassName="text-base pl-0 text-gray-400 font-[GilroySemiBold]"
                            />
                          </div>
                        ) :
                          <Field
                            id={key}
                            name={key}
                            type={data.type || 'text'}
                            className="text-base font-[GilroySemiBold] text-gray-500 placeholder:text-gray-400 placeholder:font-normal outline-none focus:outline-none border-none focus:border-none focus:ring-0"
                            placeholder={data.placeholder || ""}
                          />
                        }
                          </div>
                        </div>
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
              </div>
            </div>
          </Fragment>
        )}
      </Formik>
    </div>
  );
}
