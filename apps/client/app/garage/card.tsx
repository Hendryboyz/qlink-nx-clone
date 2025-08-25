'use client';

import React, { useState } from 'react';
import { ProductVO } from '@org/types';
import { css } from '@emotion/css';
import { DEFAULT_MODELS } from '$/utils';
import { usePopup } from '$/hooks/PopupProvider';
import Button from '$/components/Button';
import defaultMotorImage from '$/public/assets/vehicles/default_model.png';
import { STATUS_CONFIG, getStatusConfig } from '$/utils/statusConfig';

const rowCss = css`
& > div:not(:last-child)  {
  border-bottom: 1px solid #D9D9D9;
}
& > div {
  padding-left: 12px;
  height: 2.8125rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

  // Get status configuration
  const statusConfig = getStatusConfig(data.verifyStatus);

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
  const modelImage = modelDefined?.img || defaultMotorImage.src;
  return (
    <>
      <div
        className="relative flex justify-between min-h-[164px] bg-[#C3C3C3]"
        style={{
          backgroundImage: `url(${modelImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Status Badge */}
        <div
          className="absolute top-6 left-6 w-[68px] h-[24px] rounded flex items-center justify-center"
          style={{ backgroundColor: statusConfig.bgColor }}
        >
          <span className="text-white text-[14px] font-[GilroyBold] leading-[16px]">
            {statusConfig.text}
          </span>
        </div>

        <div className="ml-9 mb-2 self-end">
          <p className="text-xl text-white font-[GilroyLight]">{data.year}</p>
          <h2 className="text-3xl font-gilroy-heavy text-primary-500 -mt-2">{modelDefined ? modelDefined.title : model}</h2>
        </div>
        <img
          className="mr-6 mt-6 self-start"
          src="/assets/file_edit.svg"
          alt="edit"
          onClick={() => {
            handleEdit(data);
          }}
        />
      </div>
      <div className={`pt-4 px-6 bg-gray-700 text-white ${rowCss}`}>
        <div>
          <p className="title">Registration ID</p>
          <p className="font-[GilroySemiBold]">{id}</p>
        </div>
        <div>
          <p className="title">VIN Number</p>
          <p className="font-[GilroySemiBold]">{vin}</p>
        </div>
        <div>
          <p className="title">Engine Serial Number</p>
          <p className="font-[GilroySemiBold]">{engineNumber}</p>
        </div>
        <div>
          <p className="title">Purchase Date</p>
          <p className="font-[GilroySemiBold]">{purchaseDate}</p>
        </div>
        <div>
          <p className="title">Registration Date</p>
          <p className="font-[GilroySemiBold]">{registrationDate}</p>
        </div>
        <div className="border-b border-[#D9D9D9]">
          <p className="title">Dealer Name</p>
          <p className="font-[GilroySemiBold]">{dealerName}</p>
        </div>

        </div>
        <div className="pt-4 pb-6 bg-gray-700 flex justify-center">
          <button
            className={`rounded-lg text-base text-center leading-[27px] border-none h-[27px] whitespace-nowrap font-[GilroySemiBold] tracking-[0%] ${
              isGiftRedeemed
                ? 'text-white bg-gray-500 cursor-not-allowed opacity-60 w-[210px]'
                : 'text-[#DF6B00] bg-[#FFD429] cursor-pointer hover:bg-[#E5C027] w-[191px]'
            }`}
            disabled={isGiftRedeemed}
            onClick={(e) => {
              e.stopPropagation();

              if (isGiftRedeemed) return;

              // Show confirmation popup
              showPopup({
                useDefault: false,
                title: 'Redeem Welcome Gift?',
                hasDetailText: true,
                detailText: 'This will confirm that the welcome gift has been claimed. Please ask the authorized QLINK dealer to click this button for you.',
                content: (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Button
                      className="rounded-lg bg-[#D70127] text-white font-[GilroySemiBold] h-[30px]"
                      style={{ fontSize: '14px', width: '100px' }}
                      onClick={hidePopup}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="rounded-lg bg-[#D70127] text-white font-[GilroySemiBold] h-[30px]"
                      style={{ fontSize: '14px', width: '100px' }}
                      onClick={() => {
                        hidePopup();
                        // Show success popup
                        showPopup({
                          useDefault: false,
                          title: 'Gift Redeemed',
                          content: (
                            <div className="flex justify-center">
                              <Button
                                className="bg-red-600 hover:bg-red-700 text-white font-[GilroySemiBold] px-6 py-2 rounded-lg h-[30px] text-sm"
                                style={{ width: '216px' }}
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
                )
              });
            }}
          >
            {isGiftRedeemed ? 'Welcome Gift Redeemed' : 'Redeem Welcome Gift'}
          </button>
      </div>
    </>
  );
};

export default ProductCard;
