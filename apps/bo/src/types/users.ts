import { UserVO } from '@org/types';

export interface GetUsersResponse {
  data: UserVO[];
  total: number;
}

export interface MutateUserResponse {
  affectedRows: number;
}

export interface GetUsersFilters {
  memberId?: string;
  firstName?: string;
  midName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  addressCity?: string;
  addressState?: string;
}

export interface ListBoUsersResponse {
  data: UserVO[];
  total: number;
}
