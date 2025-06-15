import { UserVO } from '@org/types';

export interface GetUsersResponse {
  data: UserVO[];
  total: number;
}

export interface MutateUserResponse {
  affectedRows: number;
}

export interface ListBoUsersResponse {
  data: UserVO[];
  total: number;
}
