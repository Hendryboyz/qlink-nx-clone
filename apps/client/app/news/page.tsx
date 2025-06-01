'use client'

import React, { useEffect, useState } from "react";
import Header from "$/components/Header";
import { PostEntity } from "@org/types";
import NewsItem from "$/components/News/item";
import API from "$/utils/fetch";


const News = () => {
  const [posts, setPosts] = useState<PostEntity[]>([])
  useEffect(() => {
    API.get<PostEntity[]>('/posts')
      .then(res => {
        setPosts(res);
      })
  }, [])
    return <div className="w-full min-h-full flex-1">
      <Header title="News" />
      <div className="space-y-3 p-6 md:grid md:grid-cols-2 lg:grid-cols-3">
          {posts.map((item, index) => (
            <div key={index}>
              <NewsItem
                key={index}
                type={item.category}
                title={item.title}
                date={new Date(item.createdAt)}
                imgUrl={item.coverImage}
                id={item.id} />
            </div>
          ))}
        </div>
      </div>
}

export default News
