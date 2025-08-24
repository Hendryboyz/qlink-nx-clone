'use client';

import React, { useEffect, useState } from 'react';
import Header from '$/components/Header';
import { fromDateWithSlash } from '@org/common';
import { NextPage } from 'next';
import API from '$/utils/fetch';
import { PostEntity } from '@org/types';
import NewsType from '$/components/News/type';

type Props = {
  params: {
    id: string;
  };
};

const Detail: NextPage<Props> = ({ params }) => {
  const [post, setPost] = useState<PostEntity | null>(null);
  useEffect(() => {
    API.get<PostEntity>(`/posts/detail/${params.id}`).then((res) => {
      setPost(res);
      console.log(res);
    });
  }, []);

  return (
    <div className="w-full min-h-full flex-1 overflow-hidden">
      <Header title="News" useBackBtn={true} />
      {post && (
        <div className="max-w-full">
          <div
            className="h-60 flex flex-col justify-between"
            style={{
              backgroundImage: post.coverImage
                ? `url(${post.coverImage})`
                : undefined,
              backgroundColor: post.coverImage ? undefined : '#D9D9D9',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}
          >
            <div className="flex m-5 justify-end">
              <NewsType type={post.category} className="w-[60px] h-[20px] !text-[14px] flex items-center justify-center !pt-0" />
            </div>
            <h1 className="font-gilroy-bold text-xl pl-5 pb-3 pr-7 leading-tight">{post.title}</h1>
          </div>
          <div className="px-[20px] py-6 w-screen max-w-screen overflow-x-hidden">
            <div className="mb-3 font-[GilroyMedium] text-base">{fromDateWithSlash(new Date(post.createdAt))}</div>
            <div
              className="font-gilroy-regular text-base tracking-[0px] leading-[1.2] break-words hyphens-auto"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// export async function getServerSideProps() {
//     // 從數據庫獲取文章HTML
//     const articleHtml = await fetchArticleFromDatabase()
//     return { props: { articleHtml } }
//   }

export default Detail;
