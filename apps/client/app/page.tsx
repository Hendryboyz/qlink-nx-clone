'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import Header from '$/components/Header';
import { PostEntity } from '@org/types';
import NewsItem from '$/components/News/item';
import { useRouter } from 'next/navigation';
import API from '$/utils/fetch';
// import Carousel from '$/components/Carousel';

const menuItems = [
  { title: 'My Garage', icon: '/assets/garage_icon.svg', url: '/garage' },
  { title: 'Register Bike', icon: '/assets/register_icon.svg', url: '/garage/add' },
];


export default function Index() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostEntity[]>([])
  useEffect(() => {
    API.get<PostEntity[]>('/posts/highlight')
    .then(res => {
        setPosts(res)
    })
  },[])
  return (
    <div className="w-full md:w-10/12 min-h-full flex-col">
      <Header />
      <div className="pt-5 px-5">
        {/*<Carousel images={[]} className="mb-12" />*/}
        <div className="mb-8 relative">
          <img
            className="rounded-xl w-full h-64 max-sm:h-[150px] max-w-3xl mx-auto object-cover hover:cursor-pointer"
            src={'/assets/banner.jpg'}
            alt={'banner'}
            onClick={() => router.push('/sign-up')}
          />
          <div
            className="uppercase text-3xl text-red-600 absolute text-center top-1/2 w-full font-[GilroyHeavy] italic"
          >
            Join the club
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 justify-items-center">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="hover:cursor-pointer max-sm:odd:justify-self-end max-sm:even:justify-self-start"
              onClick={() => {
                router.push(item.url);
              }}
            >
              <img
                className="w-[120px] h-[120px] bg-gray-300 rounded-[12px] mb-3"
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
      <div className="my-5 px-5">
        <hr className="border border-[#E19500] bg-[#E19500]" />
      </div>
      <div className="px-5 pb-6 pt-2">
        <h2 className="font-[GilroyBlack] text-primary pl-5 italic text-2xl mb-6">
          Latest News
        </h2>
        <div className="grid gap-4 sm:grid-rows-6 sm:grid-cols-1 md:grid-rows-4  md:grid-cols-2 lg:grid-rows-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((item, index) => (
            <NewsItem
              key={index}
              type={item.category}
              title={item.title}
              date={new Date(item.createdAt)}
              imgUrl={item.coverImage}
              id={item.id}
            />
          ))}
        </div>
        <div className="mt-4 text-center">
          <a href="/news" className="text-primary font-[GilroyBold] text-base">
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
