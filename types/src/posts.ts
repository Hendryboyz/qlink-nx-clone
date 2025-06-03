export enum PostCategoryEnum {
  NEWS = 'News',
  PROMO = 'Promo',
  EVENT = 'Event',
  MEDIA = 'Media',
}
export interface PostEntity {
  id: string;
  title: string;
  category: PostCategoryEnum;
  content: string;
  coverImage?: string;
  isActive: boolean;
  isHighlight: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface ICreatePost {
  title: string;
  category: PostCategoryEnum;
  content: string;
  coverImage?: string;
  isActive: boolean;
  isHighlight: boolean;
}
export interface IUpdatePost extends ICreatePost {}
