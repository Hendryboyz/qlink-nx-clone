'use client';

import React from 'react';
import { ProductVO } from '@org/types';
import { css } from '@emotion/css';
import { DEFAULT_MODELS } from '$/utils';

const rowCss = css`
&>div:not(:last-child)  {
  border-bottom: 1px solid #D9D9D9;
}
& > div {
  padding-left: 12px;
}
`

const ProductCard = ({ data, handleEdit }: { data: ProductVO, handleEdit: (data: ProductVO) => void }) => {
  const {
    model,
    registrationDate,
    id,
    vin,
    engineNumber,
    purchaseDate,
    dealerName,
  } = data;
  const modelDefined = DEFAULT_MODELS.find(m => m.id.toString() === model);
  return (
    <>
      <div className="flex justify-between min-h-[164px] bg-gray-200">
        <div className="ml-9 mb-3 self-end">
          <p className="text-xl font-light text-white">{data.year}</p>
          <h2 className="text-3xl font-black text-primary-500">{modelDefined ? modelDefined.title : model}</h2>
        </div>
        <img
          className="mr-8 mt-8 self-start"
          src="/assets/edit.png"
          alt="edit"
          onClick={() => {
            handleEdit(data);
          }}
        />
      </div>
      <div className={`space-y-2 py-4 px-6 bg-gray-700 text-white ${rowCss}`}>
        <div>
          <p>Registration ID</p>
          <p className="font-semibold pb-1">{id}</p>
        </div>
        <div>
          <p>VIN Number</p>
          <p className="font-semibold pb-1">{vin}</p>
        </div>
        <div>
          <p>Engine Serial Number</p>
          <p className="font-semibold pb-1">{engineNumber}</p>
        </div>
        <div>
          <p>Purchase Date</p>
          <p className="font-semibold pb-1">{purchaseDate}</p>
        </div>
        <div>
          <p>Registration Date</p>
          <p className="font-semibold pb-1">{registrationDate}</p>
        </div>
        <div>
          <p>Dealer Name</p>
          <p className="font-semibold pb-1">{dealerName}</p>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
