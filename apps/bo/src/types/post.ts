import { PostEntity } from '@org/types';

export type FormValues = Pick<PostEntity, 'title' | 'category' | 'isActive' | 'isHighlight'>;

export interface UploadImageResponse {
  s3Uri: string;
  imageUrl: string;
}

export interface GetPostsResponse {
  data: PostEntity[];
  total: number;
  highlightCount: number;
}
