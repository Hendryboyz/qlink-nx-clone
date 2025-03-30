'use client';

import React, { useEffect, useState } from 'react';
import Header from '$/components/Header';
import { fromDate } from '@org/common';
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
    <div className="w-full min-h-full flex-1">
      <Header title="News" />
      {post && (
        <div>
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
            <div className="flex m-6 justify-end">
              <NewsType type={post.category} />
            </div>
            <h1 className="font-bold text-2xl p-6">{post.title}</h1>
          </div>
          <div className="p-6">
            <div className="my-5">{fromDate(new Date(post.publishStartDate))}</div>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
