'use client';

import React, { useState } from 'react';
import { ProductVO } from '@org/types';
import { css } from '@emotion/css';
import { DEFAULT_MODELS } from '$/utils';
import { usePopup } from '$/hooks/PopupProvider';
import Button from '$/components/Button';
// TODO: Need to change to dynamically get pictures in future version
import defaultMotorImage from '$/public/assets/sym125.png';

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
  const { showPopup, hidePopup } = usePopup();
  
  // Helper functions to manage gift redemptions in localStorage
  const getGiftRedemptions = () => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem('gift_redemptions');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const setGiftRedemption = (userId: string, registrationDate: string, redeemed: boolean) => {
    if (typeof window === 'undefined') return;
    const redemptions = getGiftRedemptions();
    const key = `${userId}_${registrationDate}`;
    redemptions[key] = redeemed;
    localStorage.setItem('gift_redemptions', JSON.stringify(redemptions));
  };

  // Check if gift has been redeemed from localStorage
  const [isGiftRedeemed, setIsGiftRedeemed] = useState(() => {
    const redemptions = getGiftRedemptions();
    const key = `${data.userId}_${data.registrationDate}`;
    return redemptions[key] === true;
  });

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
      <div
        className="flex justify-between min-h-[164px] bg-[#C3C3C3]"
        style={{
          backgroundImage: `url(${defaultMotorImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
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
        <div className="px-6 py-3 bg-gray-700 flex justify-center">
          <button
            className={`w-full mt-2 px-2 rounded-lg text-base text-center flex items-center justify-center leading-none border-none h-[27px] ${
              isGiftRedeemed
                ? 'text-white bg-gray-500 cursor-not-allowed opacity-60 max-w-[240px]'
                : 'text-[#DF6B00] bg-[#FFD429] cursor-pointer hover:bg-[#E5C027] max-w-[191px]'
            }`}
            style={{
              // todo: need check font source
              fontFamily: 'GilroySemiBold',
              letterSpacing: '0%'
            }}
            disabled={isGiftRedeemed}
            onClick={(e) => {
              e.stopPropagation();

              if (isGiftRedeemed) return;

              // Show confirmation popup
              showPopup({
                useDefault: false,
                title: 'Redeem Welcome Gift?',
                content: (
                  <div className="px-4 py-4">
                    <p className="text-[#D70127] text-sm mb-6 font-[GilroyRegular]">
                      This will confirm that the welcome gift has been claimed. Please ask the authorized QLINK dealer to click this button for you.
                    </p>
                    <div className="flex items-center justify-between gap-4 w-full">
                      <Button
                        className="py-2 px-6 text-sm rounded-lg h-10 w-full bg-[#D70127] text-white font-bold"
                        onClick={hidePopup}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="py-2 px-6 text-sm rounded-lg h-10 w-full bg-[#D70127] text-white font-bold font-[GilroySemiBold]"
                        onClick={() => {
                          hidePopup();
                          // Show success popup
                          showPopup({
                            useDefault: false,
                            title: 'Gift Redeemed',
                            content: (
                              <div className="flex justify-center py-4">
                                <Button
                                  className="py-2 px-6 text-xs leading-tight rounded-lg h-10 w-48 bg-[#D70127] text-white font-bold font-[GilroySemiBold]"
                                  onClick={() => {
                                    // Save redemption status to localStorage
                                    setGiftRedemption(data.userId, data.registrationDate, true);
                                    setIsGiftRedeemed(true);
                                    hidePopup();
                                  }}
                                >
                                  Enjoy!
                                </Button>
                              </div>
                            )
                          });
                        }}
                      >
                        OK
                      </Button>
                    </div>
                  </div>
                )
              });
            }}
          >
            {isGiftRedeemed ? 'Welcome Gift Redeemed' : 'Redeem Welcome Gift'}
          </button>
        </div>
      </div>

    </>
  );
};

export default ProductCard;
