import React from 'react';
import { PostCategoryEnum } from '@org/types';
import { fromDate } from '@org/common';
import { useRouter } from 'next/navigation';
import { API_PUBLIC_HOST } from '$/utils';

const getTypeColor = (type: PostCategoryEnum) => {
  switch (type) {
    case PostCategoryEnum.NEWS:
      return 'bg-blue-100';
    case PostCategoryEnum.PROMO:
      return 'bg-orange-500';
    case PostCategoryEnum.EVENT:
      return 'bg-red-200';
    case PostCategoryEnum.MEDIA:
      return 'bg-green-200';
    default:
      return 'bg-gray-500';
  }
};

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


  const imageSource = imgUrl ? `${API_PUBLIC_HOST}${imgUrl}` : getTypeDefaultImage(type);

  return (
    <div
      className="sm:basis-full md:basis-1/3 lg:basis-1/4 flex items-start space-x-4"
      onClick={() => {
        router.push(`/news/detail/${id}`);
      }}
    >
      <div className="rounded-xl w-24 h-24 bg-gray-300 flex-shrink-0">
        <img className="rounded-xl w-full h-full object-cover" src={imageSource} />
      </div>
      <div className="py-3">
        <div className="flex items-center space-x-2 mb-1">
          <span
            className={`text-xs text-white px-2 py-1 rounded ${getTypeColor(
              type
            )}`}
          >
            {type}
          </span>
          <span className="text-xs">{fromDate(date)}</span>
        </div>
        <p className="text-sm font-bold h-16">{title}</p>
      </div>
    </div>
  );
};

export default NewsItem;
