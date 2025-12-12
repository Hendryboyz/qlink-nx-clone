import { ApiProperty } from '@nestjs/swagger';

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
  crmId?: string;
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

export class ClientUserUpdateDto {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  midName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  birthday?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  addressCity?: string;

  @ApiProperty()
  addressState?: string;

  @ApiProperty()
  facebook?: string;

  @ApiProperty()
  whatsapp?: string;

  @ApiProperty()
  source?: number;
}
export class UserUpdateDto extends ClientUserUpdateDto {
  addressDetail?: string
  password?: string;
  isDelete?: boolean;
  avatarS3uri?: string;
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
