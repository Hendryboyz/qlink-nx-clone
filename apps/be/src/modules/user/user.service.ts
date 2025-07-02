import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IdentifierType, RegisterDto, UserEntity, UserUpdateDto, UserVO } from '@org/types';
import { UserRepository } from './user.repository';
import { omit } from 'lodash';
import { ENTITY_PREFIX, generateSalesForceId } from '$/modules/utils/id.util';

type UserOmitFields = ('birthday' | 'whatsapp' | 'facebook');

@Injectable()
export class UserService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async findOne(phone: string): Promise<UserEntity> {
      return await this.userRepository.findByPhone(phone)
  }

  async findOneWithType(identifier: string, type: IdentifierType): Promise<UserEntity | null> {
    return await this.userRepository.findWithType(identifier, type)
  }

  async getUserInfo(userId: string): Promise<UserVO | undefined> {
    const user = await this.userRepository.findById(userId)
    return this.filterUserInfo(user);
  }

  private filterUserInfo(user: UserEntity, additionOmitFields: UserOmitFields[] = []): UserVO | undefined {
    return {
      ...omit(user, ['isDelete', 'createdAt', 'updatedAt', 'password', ...additionOmitFields]),
    }
  }

  async isEmailExist(email: string): Promise<boolean> {
    return await this.userRepository.isEmailExist(email);
  }

  async create(createUserDto: RegisterDto, hashedPassword: string): Promise<UserVO> {
    const userEntity = await this.userRepository.create({
     ...omit(createUserDto, ['password', 'rePassword']),
      password: hashedPassword,
      memberId: await this.generateMemberId(),
    });
    return {
      ...omit(userEntity, [
        'createdAt',
        'updatedAt',
        'isDelete',
        'password',
      ]),
    };
  }

  private async generateMemberId() {
    const current = new Date();
    const thisYear = current.getFullYear();
    const userCountThisYear = await this.userRepository.countByTime(thisYear, null);
    return generateSalesForceId(ENTITY_PREFIX.member, userCountThisYear);
  }

  async updatePassword(userId: string, password: string): Promise<UserVO> {
    const userEntity = await this.userRepository.update(userId, { password });
    return this.filterUserInfo(userEntity, [ 'birthday' ]);
  }

  async updateUser(userId: string, updateData: UserUpdateDto): Promise<UserVO> {
    if (updateData.password != null) throw new BadRequestException();

    const userEntity = await this.userRepository.update(userId, updateData);
    return this.filterUserInfo(userEntity);
  }

  public async updateUserAvatar(userId: string, s3Key: string) {
    this.logger.debug(`Updating user ${userId} avatar with ${s3Key}`);
    const userEntity = await this.userRepository.update(userId, { avatarS3uri: s3Key });
    return this.filterUserInfo(userEntity);
  }

  public async findByPage(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: UserVO[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {data, total} = await this.userRepository.findByPage(page, limit);
    return {data, total, page, limit };
  }

  public delete(id: string): Promise<number> {
    return this.userRepository.delete(id);
  }

  public isExistingIdentifier(identifier: string, identifierType: IdentifierType): Promise<boolean> {
    return this.userRepository.isIdentifierExist(identifier, identifierType);
  }
}
