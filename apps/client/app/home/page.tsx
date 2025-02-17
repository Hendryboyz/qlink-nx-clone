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
  { title: 'My Garage', icon: '🏠', url: '/garage' },
  { title: 'Register Bike', icon: '🚲', url: '' },
  { title: 'Service Records', icon: '📋', url: '' },
  { title: 'Coupons', icon: '🎟️', url: '' },
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
    <div className="w-full  min-h-full flex-1">
      <Header />
      <div className="p-6">
        <Carousel images={[]} className="mb-9" />
        <div className="grid grid-cols-2 gap-11">
          {menuItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center" onClick={() => {
              router.push(item.url)
            }}>
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl mb-3">
                {item.icon}
              </div>
              <span className="text-sm">{item.title}</span>
            </div>
          ))}
        </div>
        {/* News */}
      </div>
      <div className="bg-orange-300 p-6 max-w-md">
        <h2 className="text-primary pl-6 font-bold italic text-2xl mb-3">Latest News</h2>
        <div className="space-y-4">
          {posts.map((item, index) => (
            <NewsItem key={index} type={item.category} title={item.title} date={new Date(item.publishStartDate)} imgUrl={item.coverImage} id={item.id} />
          ))}
        </div>
        <div className="mt-4 text-center">
          <a href="/news" className="text-primary font-bold text-base">
            Check for more
          </a>
        </div>
      </div>
    </div>
  );
}
