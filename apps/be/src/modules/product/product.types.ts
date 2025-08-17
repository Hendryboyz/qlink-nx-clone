import { ProductEntity } from '@org/types';

export type CountProductFieldType = {
  [P in keyof ProductEntity]?: ProductEntity[P];
} & { count: number };
