'use client';

import React from 'react';
import Carousel from '$/components/Carousel';
import { TGButton } from '@org/components';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const slides = [
  {
    image: '/assets/v2/Banner01.png',
    title: 'Check your favorite products',
  },
  {
    image: '/assets/v2/Banner02.png',
    title: 'Get member exclusive promotions',
  },
  {
    image: '/assets/v2/Banner03.png',
    title: 'Receive coupons for discounts',
  },
  {
    image: '/assets/v2/Banner04.png',
    title: 'Manage your service records easily',
  },
];

export default function Welcome() {
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    // Override default Carousel settings to use standard dots structure which we style with CSS
    appendDots: (dots: React.ReactNode) => <ul>{dots}</ul>,
    customPaging: (i: number) => <button>{i + 1}</button>,
  };

  return (
    <div className="flex flex-col size-full bg-white">
      <div className="flex-1 flex flex-col">
        <Carousel
          settings={settings}
          className="welcome-slider flex-1 pb-8"
        >
          {slides.map((slide, index) => (
            <div key={index} className="outline-none h-full">
              <div className="relative w-full aspect-[375/480]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
              <div className="mt-8 px-8 text-center">
                <h2 className="text-lg font-bold text-gray-900 font-manrope leading-tight">
                  {slide.title}
                </h2>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <div className="px-6 pb-10 pt-2 flex flex-col gap-6 items-center w-full">
        <div className="w-full">
          <TGButton
            fullWidth
            size="xl"
            variant="primary"
            onClick={() => router.push('/sign-up')}
          >
            Join the club
          </TGButton>
        </div>

        <Link
          href="/login"
          className="text-primary font-bold text-base hover:underline font-manrope"
        >
          Log In
        </Link>
      </div>

      <style jsx global>{`
        .welcome-slider .slick-dots {
          bottom: -10px;
          position: relative;
          margin-top: 20px;
        }
        .welcome-slider .slick-dots li {
          margin: 0 3px;
          width: 6px;
          height: 6px;
        }
        .welcome-slider .slick-dots li button {
          width: 6px;
          height: 6px;
          padding: 0;
        }
        .welcome-slider .slick-dots li button:before {
          font-size: 6px;
          color: #e5e7eb;
          opacity: 1;
          width: 6px;
          height: 6px;
          line-height: 6px;
          content: '•';
        }
        .welcome-slider .slick-dots li.slick-active button:before {
          color: #d70127;
        }
      `}</style>
    </div>
  );
}
