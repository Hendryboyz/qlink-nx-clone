import { UserEntity, UserVO } from '@org/types';
import { omit } from 'lodash';

type UserOmitFields = ('birthday' | 'whatsapp' | 'facebook');

export function filterUserInfo(
  user: UserEntity,
  additionOmitFields: UserOmitFields[] = []
): UserVO | undefined {
  return {
    ...omit(user, [
      'isDelete',
      'createdAt',
      'updatedAt',
      'password',
      ...additionOmitFields,
    ]),
  };
}
