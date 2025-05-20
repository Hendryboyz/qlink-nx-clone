'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import Header from '$/components/Header';
import Carousel from '$/components/Carousel';
import { PostEntity } from '@org/types';
import NewsItem from '$/components/News/item';
import { useRouter } from 'next/navigation';
import API from '$/utils/fetch';

const menuItems = [
  { title: 'My Garage', icon: '/assets/garage_icon.svg', url: '/garage' },
  { title: 'Register Bike', icon: '/assets/register_icon.svg', url: '/garage/add' },
  // { title: 'Service Records', icon: '📋', url: '' },
  // { title: 'Coupons', icon: '🎟️', url: '' },
];


export default function Index() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostEntity[]>([])
  useEffect(() => {
    API.get<PostEntity[]>('/posts')
    .then(res => {
        setPosts(res)
    })
  },[])
  return (
    <div className="w-full md:w-10/12 min-h-full flex-col">
      <Header />
      <div className="p-5">
        {/*<Carousel images={[]} className="mb-12" />*/}
        <div className="mb-5 relative">
          <img
            className="rounded-xl w-full h-64 max-w-3xl mx-auto object-cover hover:cursor-pointer"
            src={'/assets/banner.jpg'}
            alt={'banner'}
            onClick={() => router.push('/sign-up')}
          />
          <div
            className="uppercase text-6xl text-red-600 absolute text-center top-1/2 w-full font-[GilroyBlack]"
          >
            Join the club
          </div>
        </div>
        <div className="grid grid-cols-2 gap-11">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center hover:cursor-pointer"
              onClick={() => {
                router.push(item.url);
              }}
            >
              <img
                className="w-28 h-28 bg-gray-300 rounded-md mb-3"
                src={item.icon}
                alt={item.title}
              />
              {/*<span className="text-[18px] font-[GilroyBlack] text-[#65696E]">*/}
              {/*  {item.title}*/}
              {/*</span>*/}
            </div>
          ))}
        </div>
      </div>
      {/* News */}
      <div className="mt-5 mb-8 px-6">
        <hr className="border border-[#E19500] bg-[#E19500]" />
      </div>
      <div className="p-6">
        <h2 className="font-[GilroyBlack] text-primary pl-6 font-bold italic text-2xl mb-9">
          Latest News
        </h2>
        <div className="grid gap-4 grid-rows-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((item, index) => (
            <NewsItem
              key={index}
              type={item.category}
              title={item.title}
              date={new Date(item.publishStartDate)}
              imgUrl={item.coverImage}
              id={item.id}
            />
          ))}
        </div>
        <div className="mt-4 text-center">
          <a href="/news" className="text-primary font-bold text-base">
            Check for more
            <img
              className="inline ml-1"
              src="/assets/arrow_circle_right.svg"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
