import React from 'react';
import { PostCategoryEnum } from '@org/types';

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
  type: PostCategoryEnum
}

const NewsType: React.FC<Props> = ({ type }: Props) => {
  return (
    <span
      className={`text-[8px] text-white h-3 w-9 text-center rounded ${getTypeColor(type)}`}
    >
      {type}
    </span>
  );
};

export default NewsType;
