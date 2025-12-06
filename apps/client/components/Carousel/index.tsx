'use client';

import React, { HTMLAttributes } from 'react';
import Slider, { Settings } from 'react-slick';
import { twMerge } from 'tailwind-merge';


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
  settings?: Settings;
};

const defaultSettings: Settings = {
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
  className,
  children,
  settings = {},
}) => {
  const finalSettings = { ...defaultSettings, ...settings };

  return (
    <div className={twMerge('w-full relative group', className)}>
      <Slider {...finalSettings}>{children}</Slider>
    </div>
  );
};

export default ReactSlickCarousel;
