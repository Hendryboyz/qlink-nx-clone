'use client';

import React, { useEffect, useState } from 'react';
import Header from '$/components/Header';
import { fromDate } from '@org/common';
import { NextPage } from 'next';
import API from '$/utils/fetch';
import { PostEntity } from '@org/types';
import { API_PUBLIC_HOST } from '$/utils';

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
          <h1 className="font-bold text-lg p-6">{post.title}</h1>
          <div
            className="h-60 flex items-end"
            style={{
              backgroundImage: `url(${post.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}
          ></div>
          <div className="p-6">
            <span>{fromDate(new Date(post.publishStartDate))}</span>
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
