'use client';

import React from 'react';
import { ProductVO } from '@org/types';
import { css } from '@emotion/css';
import { DEFAULT_MODELS } from '$/utils';

const rowCss = css`
& > div:not(:last-child)  {
  border-bottom: 1px solid #D9D9D9;
}
& > div {
  padding-left: 12px;
  & .title {
    font-family: GilroyRegular;
    font-size: 12px;
    margin-bottom: -8px;
  }
  &:nth-of-type(n+2) .title {
    margin-top: 4px;
  }
  & p {
    font-size: 16px;
    padding-bottom: 5px;
  }
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
      <div className="flex justify-between min-h-[164px] bg-[#C3C3C3]">
        <div className="ml-9 mb-2 self-end">
          <p className="text-xl font-light text-white font-gilroy-light">{data.year}</p>
          <h2 className="text-3xl font-gilroy-heavy text-primary-500 -mt-2">{modelDefined ? modelDefined.title : model}</h2>
        </div>
        <img
          className="mr-8 mt-8 self-start"
          src="/assets/file_edit.svg"
          alt="edit"
          onClick={() => {
            handleEdit(data);
          }}
        />
      </div>
      <div className={`py-4 px-6 bg-gray-700 text-white ${rowCss}`}>
        <div>
          <p className="title">Registration ID</p>
          <p className="font-semibold">{id}</p>
        </div>
        <div>
          <p className="title">VIN Number</p>
          <p className="font-semibold">{vin}</p>
        </div>
        <div>
          <p className="title">Engine Serial Number</p>
          <p className="font-semibold">{engineNumber}</p>
        </div>
        <div>
          <p className="title">Purchase Date</p>
          <p className="font-semibold">{purchaseDate}</p>
        </div>
        <div>
          <p className="title">Registration Date</p>
          <p className="font-semibold">{registrationDate}</p>
        </div>
        <div>
          <p className="title">Dealer Name</p>
          <p className="font-semibold">{dealerName}</p>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
