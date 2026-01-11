import React from 'react';
import { PostCategoryEnum } from '@org/types';

const newsItems = [
  {
    categoryColor: '#8F021B',
    categoryBgColor: '#FFEAEA',
  },
  {
    categoryColor: '#934200',
    categoryBgColor: '#FFF6E7',
  },
  {
    categoryColor: '#026900',
    categoryBgColor: '#ECFFE9',
  },
  {
    categoryColor: '#0D1BB7',
    categoryBgColor: '#E8F0FF',
  },
];

const getNewsItemColor = (type: PostCategoryEnum, index: number = 0) => {
  const typeIndexMap: Record<PostCategoryEnum, number> = {
    [PostCategoryEnum.NEWS]: 0,
    [PostCategoryEnum.PROMO]: 1,
    [PostCategoryEnum.EVENT]: 2,
    [PostCategoryEnum.MEDIA]: 3,
  };
  const idx = typeIndexMap[type] ?? (index % newsItems.length);
  return newsItems[idx];
};

type Props = {
  type: PostCategoryEnum;
  className?: string;
  index?: number;
};

const NewsType: React.FC<Props> = ({ type, className, index = 0 }: Props) => {
  const colors = getNewsItemColor(type, index);
  return (
    <span
      className={`py-1 px-4 ${className || ''}`}
      style={{
        backgroundColor: colors.categoryBgColor,
        color: colors.categoryColor,
      }}
    >
      {type}
    </span>
  );
};

export default NewsType;
