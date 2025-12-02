'use client';

import React, { HTMLAttributes } from 'react';
import Slider, { Settings } from 'react-slick';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

import { TGButton } from '@org/components';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export interface CarouselItem {
  src: string;
  alt: string;
  buttonText?: string;
  link?: string;
}

type ImageCarouselProps = HTMLAttributes<HTMLDivElement> & {
  items?: CarouselItem[];
};

const settings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: false,
  appendDots: (dots) => (
    <div
      style={{
        position: 'absolute',
        bottom: '40px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <ul className="flex items-center m-0 p-0 list-none [&>li]:!w-auto [&>li]:!h-auto [&>li]:mx-1">
        {dots}
      </ul>
    </div>
  ),
  customPaging: () => (
    <div className="w-2.5 h-2.5 rounded-full bg-white/50 transition-all duration-300 hover:bg-white cursor-pointer dot-indicator" />
  ),
};

const ReactSlickCarousel: React.FC<ImageCarouselProps> = ({
  items = [],
  className,
}) => {
  return (
    <div className={twMerge('w-full relative group', className)}>
      <Slider {...settings}>
        {items.map((item, index) => (
          <div
            key={index}
            className="relative w-full h-[600px] md:h-[800px] outline-none"
          >
            <div className="absolute inset-0 bg-black">
              {item.src && (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover opacity-90"
                  priority={index === 0}
                  unoptimized={item.src.startsWith('http')}
                />
              )}
            </div>
            <div className="absolute z-10 bottom-20 flex flex-col items-center w-full">
              {item.buttonText && (
                <TGButton variant="primary" size="md" className='w-auto'>
                  {item.buttonText}
                </TGButton>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ReactSlickCarousel;
