export interface UserEntity {
  id: string;
  phone: string;
  type: UserType;
  email?: string;
  password: string;
  memberId: string;
  firstName: string;
  midName?: string;
  lastName: string;
  gender: GenderType;
  avatarS3Uri?: string;
  addressState: string;
  addressCity: string;
  addressDetail?: string;
  birthday?: string;
  source?: number;
  whatsapp?: string;
  facebook?: string;
  createdAt: Date;
  updatedAt: Date;
  isDelete: boolean;
}

export type User = Omit<UserEntity, 'createdAt' | 'updatedAt' | 'isDelete'>;

export type UserVO = Omit<User, 'password' | 'birthday'> & {
  birthday?: string;
  avatarImageUrl?: string;
}
export type UserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isDelete' | 'birthday'> & {
  birthday?: string;
}

export interface ClientUserUpdateDto {
  firstName?: string;
  midName?: string;
  lastName?: string;
  birthday?: string;
  email?: string;
  phone?: string;
  addressCity?: string;
  addressState?: string;
  facebook?: string;
  whatsapp?: string;
  source?: number;
}
export interface UserUpdateDto extends ClientUserUpdateDto {
  addressDetail?: string
  password?: string;
  isDelete?: boolean;
  avatarS3uri?: string;
}

export enum UserType {
  CLIENT = 'client',
}

export type GenderType = 'Male' | 'Female' | 'Other';

export enum UserSourceType {
  NONE = 0,
  FriendsOrFamilyReferrals = 1,
  Online = 2,
  RetailShop = 3,
  SalesEvent = 4,
  ServiceCenter = 5
}
