'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Header from '$/components/Header';
import { ProductVO } from '@org/types';
import ProductCard from './card';
import { useRouter } from 'next/navigation';
import API from '$/utils/fetch';
import GarageEdit from './edit';
import defaultMotorImage from '$/public/assets/vehicles/default_model.png';
import { DEFAULT_MODELS } from '$/utils';

export default function Garage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<ProductVO | null>(null);
  const [products, setProducts] = useState<ProductVO[]>([]);
  const [currentProduct, setCurrentProduct] = useState<ProductVO>({
    id: '',
    userId: '',
    vin: '',
    engineNumber: '',
    year: NaN,
    purchaseDate: '',
    registrationDate: '',
    dealerName: '',
    model: '',
  });
  const handleFetch = useCallback(() => {
    API.get<ProductVO[]>('/product/list').then((res) => {
      setProducts(res);
    });
  }, []);
  useEffect(() => {
    handleFetch();
  }, []);
  return isEditMode && editData ? (
    <GarageEdit
      data={editData}
      onCancel={() => {
        handleFetch();
        setEditData(null);
        setIsEditMode(false);
      }}
      onRemove={() => {
        handleFetch();
        setEditData(null);
        setIsEditMode(false);
      }}
    />
  ) : (
    <div className="w-full  min-h-full flex-1">
      <Header title="My Garage" />
      <div className="px-6 py-4">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {products.map((product) => {
              const model = DEFAULT_MODELS.find(m => m.id.toString() === product.model);
              const modelTitle = model?.title || product.model;
              const modelImage = model?.img || defaultMotorImage.src;
              return (
                <div
                  key={product.id}
                  className="flex flex-col max-w-[320px] w-full rounded-2xl overflow-hidden shadow-lg"
                  onClick={() => {
                    setCurrentProduct(product);
                    setIsModalOpen(true);
                  }}
                >
                  {/*<div className="h-24 bg-gray-300" />*/}
                  <div
                    style={{
                      height: '6rem',
                      backgroundImage: `url(${modelImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center center',
                      backgroundColor: '#DFDFDF'
                    }}
                  />
                  {/* Placeholder for image */}
                  <div className="px-4 py-[6px] bg-gray-500 flex justify-between text-white">
                    <div className="font-gilroy-bold text-[13px]">{modelTitle || product.model}</div>
                    <p className="text-xs font-gilroy-regular">{product.vin}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex justify-center">
            <img
              src="/assets/add_square.svg"
              alt="add"
              className="w-6"
              onClick={() => {
                router.push('/garage/add');
              }}
            />
          </div>
        </div>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="rounded-3xl overflow-hidden shadow-xl w-[264px] m-4">
              <ProductCard
                data={currentProduct}
                handleEdit={(data) => {
                  setEditData(data);
                  setIsEditMode(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
