'use client'

import React, { HTMLAttributes } from 'react';
import Slider, { Settings } from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ImageItem {
  src: string;
  alt: string;
}

type ImageCarouselProps = HTMLAttributes<HTMLDivElement> & {
  images: ImageItem[];
}


const ReactSlickCarousel: React.FC<ImageCarouselProps> = ({ images, className }) => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    dotsClass: '!bottom-6 slick-dots'
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <Slider {...settings}>
        {[1,2,3].map((image, index) => (
          <div key={index} className={`rounded-xl relative h-64 w-full bg-blue-100`}>
            {/* <Image
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
            /> */}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ReactSlickCarousel;
