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
import DropdownField from '$/components/Dropdown';
import DateField from '$/components/Fields/DateField';
import Button from '$/components/Button';
import { DEFAULT_MODELS } from '$/utils';
const CreateSchema = Yup.object().shape({
  model: Yup.string().required('Required'),
  year: Yup.number().required('Required').typeError("Required"),
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
  model: string;
  year: number | '0000';
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
  };
};
const defaultValue: FormData = {
  model: '',
  year: '0000',
  vin: '0000',
  dealerName: 'X',
  engineNumber: '0000',
  purchaseDate: '0000-00-00',
  registrationDate: '0000-00-00',
};
const ATTRS: Columns = {
  model: {
    title: 'Model',
    type: 'select',
  },
  year: {
    title: 'Year',
    type: 'number',
  },
  vin: {
    title: 'VIN No.',
  },
  engineNumber: {
    title: 'Engine Serial No.',
  },
  purchaseDate: {
    title: 'Purchase Date',
    type: 'date'
  },
  registrationDate: {
    title: 'Registration Date',
    type: 'date'
  },
  dealerName: {
    title: 'Dealer Name',
  },
};
export default function GarageAdd() {
  const DEFAULT_ERROR_MSG_CLASS = 'text-red-500 absolute top-0 right-0 text-xs text-right pl-3';
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
                title: 'Your product has been registered.',
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
              <div className="mt-6 pl-2">
                {(Object.entries(ATTRS) as [KEY, Columns[KEY]][]).map(
                ([key, data]) => {
                  return (
                    <div
                      className="flex justify-between items-center min-h-[3.1875rem] pl-[1.25rem] pr-[1.25rem] border-b-inset-6"
                      key={key}
                    >
                      <div className="flex flex-col text-gray-400 flex-1">
                        <span className="text-xs font-gilroy-regular text-[12px] text-[#D70127]">{data.title}</span>
                        <div className="h-auto min-h-4 flex flex-col content-around -mt-1">
                        {data.type == 'select' ? (
                          <div className="w-full" style={{ color: '#6b7280', fontWeight: '600' }}>
                            <DropdownField
                              id={key}
                              name={key}
                              placeholder="X"
                              options={models.map((vo) => ({
                                value: vo.id,
                                label: vo.title,
                              }))}
                              label={data.title}
                              className="w-full min-w-60 h-6"
                              textSize="text-base"
                            />
                          </div>
                        ) : data.type === 'date' ? (
                          <DateField
                            name={key}
                            defaultDisplayValue="0000-00-00"
                            className="text-base pl-0 min-h-[24px] font-semibold text-gray-500"
                          />
                        ) :
                          <Field
                            id={key}
                            name={key}
                            type={data.type || 'text'}
                            className="text-base font-semibold text-gray-500"
                            placeholder=""
                          />
                        }
                        <ErrorMessage
                          name={key}
                          className={DEFAULT_ERROR_MSG_CLASS}
                          component="span"
                        />
                        </div>
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
