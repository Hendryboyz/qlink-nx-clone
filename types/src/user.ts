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
  coverImageS3Uri?: string;
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
  crmId?: string;
  isDelete: boolean;
}

export interface User extends Omit<UserEntity, 'createdAt' | 'updatedAt' | 'isDelete'> {}

export interface UserVO extends Omit<User, 'password'> {
  avatarImageUrl?: string;
  coverImageUrl?: string;
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
  coverImageS3uri?: string;
  crmId?: string;
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
