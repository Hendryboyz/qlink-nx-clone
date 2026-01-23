'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TGButton, BottomNav } from '@org/components';
import Carousel from '$/components/Carousel';
import NavBar from '$/components/NavBar';
import AppFooter from '$/components/AppFooter';
import NewsType from '$/components/News/type';
import { useRouter } from 'next/navigation';
import { useAuth } from '$/hooks/useAuth';
import API from '$/utils/fetch';
import { PostEntity } from 'types/src/posts';
import dayjs from 'dayjs';

const CarouselItems = [
  {
    src: '/assets/v2/Banner01.png',
    alt: '',
    buttonText: 'Sign Up Now',
    link: '/welcome',
  },
  {
    src: '/assets/v2/Banner02.png',
    alt: '',
    buttonText: 'Go to Website',
  },
  {
    src: '/assets/v2/Banner03.png',
    alt: '',
    buttonText: 'View Detail',
  },
  {
    src: '/assets/v2/Banner04.png',
    alt: '',
    buttonText: 'Sign Up Now',
  },
];

export default function Index() {
  const [activeItem, setActiveItem] = useState<string>();
  const [navHeight, setNavHeight] = useState(55);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const [posts, setPosts] = useState<PostEntity[]>([]);

  useEffect(() => {
    API.get<PostEntity[]>('/posts').then((res) => {
      setPosts(res);
    });
  }, []);

  return (
    <div
      className="size-full relative bg-secondary"
      style={{ paddingTop: `${navHeight}px` }}
    >
      <NavBar
        imgSrc="/assets/v2/logo.svg"
        isSignedIn={isSignedIn}
        onSignInClick={() => router?.push('/welcome')}
        onNavHeightChange={setNavHeight}
      />

      <span className="p-4 bg-primary text-sm font-manrope text-fill flex items-center py-4 justify-center">
        Exclusive Member Test Ride See details
      </span>
      <Carousel>
        {CarouselItems.map((item, index) => (
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
                <TGButton
                  variant="primary"
                  size="md"
                  className="w-auto"
                  onClick={() => {
                    if (item.link) {
                      router?.push(item.link);
                    }
                  }}
                >
                  {item.buttonText}
                </TGButton>
              )}
            </div>
          </div>
        ))}
      </Carousel>
      <div
        className="p-6 grid place-items-center text-center w-full"
        style={{
          marginTop: '-6px',
        }}
      >
        <h3 className="font-bold text-text-s text-2xl">LATEST NEWS</h3>
        <div className="grid grid-1 mt-6 gap-4">
          {posts.map((item, index) => (
            <div key={item.id} className="grid grid-cols-[120px,1fr] gap-4">
              <Image
                src={item.coverImage || '/assets/v2/news-01.jpg'}
                alt={item.title}
                width={120}
                height={120}
                className="object-cover w-[120px] h-[120px]"
              />
              <div className="flex flex-col justify-between text-left rounded">
                <h4 className="text-base font-bold text-text-s mb-0">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between">
                  <NewsType type={item.category} index={index} />
                  <span>{dayjs(item.updatedAt).format('YYYY/M/DD')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <TGButton variant="outline" size="md" className="w-auto mt-6" onClick={() => {
          router?.push('/news')
        }}>
          View More News
        </TGButton>
      </div>
      <AppFooter isSignedIn={isSignedIn} />
      {isSignedIn && (
        <BottomNav
          activeItem={activeItem}
          onItemClick={(str) => setActiveItem(str)}
        />
      )}
    </div>
  );
}
