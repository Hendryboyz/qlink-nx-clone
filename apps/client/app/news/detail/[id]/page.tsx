'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fromDateWithSlash } from '@org/common';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import API from '$/utils/fetch';
import { PostEntity } from '@org/types';
import NavBar from '$/components/NavBar';
import AppFooter from '$/components/AppFooter';
import { useAuth } from '$/hooks/useAuth';
import { TGButton } from '@org/components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { ChevronLeftIcon } from 'lucide-react';

type Props = {
  params: {
    id: string;
  };
};

const Detail: NextPage<Props> = ({ params }) => {
  const [post, setPost] = useState<PostEntity | null>(null);
  const [navHeight, setNavHeight] = useState(55);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    API.get<PostEntity>(`/posts/detail/${params.id}`).then((res) => {
      setPost(res);
    });
  }, [params.id]);

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

      {post && (
        <div className="w-full">
          {/* Header with Back Button */}
          <div className="px-5 pt-4 border-gray-200">
            <button
              onClick={() => router.back()}
              className="text-gray-700 hover:text-gray-900"
            >
              <ChevronLeftIcon className="w-8 h-8" />
            </button>
          </div>

          {/* Title Section */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-black leading-tight flex-1 pr-4">
                {post.title}
              </h1>
            </div>
            <p className="text-black text-sm mb-5">
              Check out the latest model available in all our shops. Receive
              member discount by showing your Qpon on the App!
            </p>
            <div className="flex justify-between items-center">
              <TGButton variant="primary" size="md" className="w-fit">
                Purchase now
              </TGButton>
              <span className="text-text-w font-bold text-sm">
                {fromDateWithSlash(new Date(post.createdAt))}
              </span>
            </div>
          </div>

          {/* Cover Image */}
          <div className="px-5 py-4">
            <Image
              width={800}
              height={400}
              src={post.coverImage || '/assets/v2/news-01.jpg'}
              alt={post.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="px-5 py-6">
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              <ReactQuill readOnly={true} value={post.content} theme="bubble" />
            </div>
          </div>

          {/* Back to All News Button */}
          <div className="px-5 py-8">
            <TGButton
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => router.push('/news')}
            >
              Back to all news
            </TGButton>
          </div>
        </div>
      )}
      <AppFooter isSignedIn={isSignedIn} />
    </div>
  );
};

export default Detail;
