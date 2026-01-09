'use client';

import Carousel from '$/components/Carousel';
import { TGButton } from '@org/components';
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
    appendDots: (dots: React.ReactNode) => (
      <div
        style={{
          position: 'relative',
          bottom: '0',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '32px',
        }}
      >
        <ul className="flex items-center m-0 p-0 list-none [&>li]:!w-auto [&>li]:!h-auto [&>li]:mx-1">
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 mt-8 rounded-full bg-gray-200 group-[.slick-active]:bg-primary" />
    ),
  };

  return (
    <div className="flex flex-col size-full min-h-screen bg-secondary">
      <div className="flex-1 flex flex-col">
        <Carousel settings={settings} className="welcome-slider flex-1 pb-8">
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
                <h4 className="text-xl font-bold text-black font-manrope">
                  {slide.title}
                </h4>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <div className="px-6 pb-10 pt-2 flex flex-col gap-6 items-center w-full">
        <TGButton
          fullWidth
          size="xl"
          variant="primary"
          onClick={() => router.push('/sign-up')}
        >
          Join the club
        </TGButton>

        <TGButton
          fullWidth
          size="xl"
          variant="ghost"
          onClick={() => router.push('/sign-in')}
        >
          Log In
        </TGButton>
      </div>
    </div>
  );
}
