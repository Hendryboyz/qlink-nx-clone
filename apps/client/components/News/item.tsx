import React from 'react';
import { useRouter } from 'next/navigation';

import { PostCategoryEnum } from '@org/types';
import { fromDateWithSlash } from '@org/common';
import NewsType from '$/components/News/type';

type Props = {
  id: string;
  type: PostCategoryEnum;
  date: Date;
  title: string;
  imgUrl?: string;
};

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
}

const NewsItem: React.FC<Props> = ({ type, date, title, imgUrl, id }) => {
  const router = useRouter();

  const imageSource = imgUrl ? imgUrl : getTypeDefaultImage(type);

  return (
    <div
      className="flex items-start space-x-4 hover:cursor-pointer"
      onClick={() => {
        router.push(`/news/detail/${id}`);
      }}
    >
      <div className="rounded-xl w-24 h-24 bg-gray-300 flex-shrink-0">
        <img
          className="rounded-xl w-full h-full object-cover"
          src={imageSource}
          alt="preview-image"
        />
      </div>
      <div className="pt-3">
        <div className="flex items-center mb-1 ml-1">
          <NewsType type={type} className='-mt-[2px]'/>
          <span className="text-[13px] font-[GilroyMedium] ml-3">{fromDateWithSlash(date)}</span>
        </div>
        <p className="text-sm font-[GilroyBold] h-16 ml-1 leading-tight">{title}</p>
      </div>
    </div>
  );
};

export default NewsItem;
