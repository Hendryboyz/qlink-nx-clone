import { Injectable, Logger } from '@nestjs/common';
import { IdentifierType, UserEntity, UserVO } from '@org/types';
import { UserRepository } from './user.repository';
import { MemberQueryFilters } from '$/modules/user/user.types';
import { filterUserInfo } from '$/modules/user/user.utils';


@Injectable()
export class UserService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly userRepository: UserRepository
  ) { }

  public findOne(phone: string): Promise<UserEntity> {
      return this.userRepository.findByPhone(phone)
  }

  public findOneWithType(
    identifier: string,
    type: IdentifierType): Promise<UserEntity | null> {
    return this.userRepository.findWithType(identifier, type)
  }

  public async findByPage(
    page: number = 1,
    limit: number = 10,
    filters: MemberQueryFilters,
  ): Promise<{
    data: UserVO[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {data, total} =
      await this.userRepository.findByPage(page, limit, filters);
    return {data, total, page, limit };
  }

  public async getUserInfo(userId: string): Promise<UserVO | undefined> {
    const user = await this.userRepository.findById(userId)
    return filterUserInfo(user);
  }

  public isEmailExist(email: string): Promise<boolean> {
    return this.userRepository.isEmailExist(email);
  }

  public async updatePassword(userId: string, password: string): Promise<UserVO> {
    const userEntity = await this.userRepository.update(userId, { password });
    return filterUserInfo(userEntity, [ 'birthday' ]);
  }

  public async updateUserAvatar(userId: string, s3Key: string) {
    this.logger.debug(`Updating user ${userId} avatar with ${s3Key}`);
    const userEntity = await this.userRepository.update(userId, { avatarS3uri: s3Key });
    return filterUserInfo(userEntity);
  }
}
