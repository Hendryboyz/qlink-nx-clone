'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { PostEntity, PostCategoryEnum } from '@org/types';
import NewsItem from '$/components/News/item';
import NewsType from '$/components/News/type';
import NavBar from '$/components/NavBar';
import AppFooter from '$/components/AppFooter';
import { fromDateWithSlash } from '@org/common';
import API from '$/utils/fetch';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '$/hooks/useAuth';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const News = () => {
  const [navHeight, setNavHeight] = useState(55);
  const [posts, setPosts] = useState<PostEntity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    PostCategoryEnum | 'all'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    API.get<PostEntity[]>('/posts').then((res) => {
      setPosts(res);
    });
  }, []);

  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const getTypeDefaultImage = (type: PostCategoryEnum) => {
    switch (type) {
      case PostCategoryEnum.NEWS:
        return '/assets/news.jpg';
      case PostCategoryEnum.PROMO:
        return '/assets/promotion.jpg';
      case PostCategoryEnum.EVENT:
        return '/assets/events.jpg';
      default:
        return '/assets/events.jpg';
    }
  };

  const categories = [
    { label: 'Recent', value: 'all' },
    { label: 'News', value: PostCategoryEnum.NEWS },
    { label: 'Promo', value: PostCategoryEnum.PROMO },
    { label: 'Events', value: PostCategoryEnum.EVENT },
    { label: 'Media', value: PostCategoryEnum.MEDIA },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="w-full min-h-full flex-1"
      style={{ paddingTop: `${navHeight}px` }}
    >
      <NavBar
        imgSrc="/assets/v2/logo.png"
        isSignedIn={isSignedIn}
        onSignInClick={() => router?.push('/welcome')}
        onNavHeightChange={setNavHeight}
      />

      {/* Page Title */}
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-xl font-bold text-black">News</h1>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 px-5 pt-5">
        <div className="flex gap-6 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value as PostCategoryEnum);
                setCurrentPage(1);
              }}
              className={twMerge(
                'pb-3 text-base whitespace-nowrap transition-colors font-bold',
                selectedCategory === cat.value
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-stroke-s'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured News Item - First Item Enlarged */}
      {filteredPosts.length > 0 && currentPage === 1 && (
        <div
          className="px-5 py-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition"
          onClick={() => router.push(`/news/detail/${filteredPosts[0].id}`)}
        >
          <div className="rounded-lg overflow-hidden mb-4 h-80 bg-gray-300">
            <Image
              className="w-full h-full object-cover"
              width={300}
              height={300}
              src={
                filteredPosts[0].coverImage ||
                getTypeDefaultImage(filteredPosts[0].category)
              }
              alt="featured-image"
            />
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="border-l-4 border-primary pl-4">
              <p className="text-2xl font-bold text-gray-900">
                {filteredPosts[0].title}
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {filteredPosts[0]?.content && <ReactQuill readOnly={true} value={filteredPosts[0].content} theme="bubble" />}
          </p>
          <div className="flex items-center justify-between">
            {selectedCategory === 'all' && (
              <NewsType type={filteredPosts[0].category} />
            )}
            <span className="text-gray-500 text-sm">
              {fromDateWithSlash(new Date(filteredPosts[0].createdAt))}
            </span>
          </div>
        </div>
      )}

      {/* News List */}
      <div className="space-y-4 p-5">
        {currentPosts.map((item, index) => {
          const isFirstOnFirstPage = currentPage === 1 && index === 0;
          if (isFirstOnFirstPage) return null;

          return (
            <div
              key={item.id || index}
              className="border-b border-gray-100 pb-4 last:border-b-0"
            >
              <NewsItem
                type={item.category}
                title={item.title}
                date={new Date(item.createdAt)}
                imgUrl={item.coverImage}
                id={item.id}
                selectedCategory={selectedCategory}
              />
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-6 px-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &#8249;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-full font-medium transition-colors ${
                currentPage === page
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &#8250;
          </button>
        </div>
      )}
      <AppFooter isSignedIn={isSignedIn} />
    </div>
  );
};

export default News;
