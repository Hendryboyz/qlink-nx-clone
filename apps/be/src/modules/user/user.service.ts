import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IdentifierType, RegisterDto, UserEntity, UserUpdateDto, UserVO } from '@org/types';
import { UserRepository } from './user.repository';
import { omit } from 'lodash';
import { ENTITY_PREFIX, generateSalesForceId } from '$/modules/utils/auth.util';
import { MemberQueryFilters } from '$/modules/user/user.types';
import { SalesforceSyncService } from '$/modules/crm/sales-force.service';
import { ConfigService } from '@nestjs/config';

type UserOmitFields = ('birthday' | 'whatsapp' | 'facebook');

@Injectable()
export class UserService {
  private logger = new Logger(this.constructor.name);
  private readonly isProduction: boolean = false;
  constructor(
    private readonly configService: ConfigService,
    private readonly syncCrmService: SalesforceSyncService,
    private readonly userRepository: UserRepository
  ) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
  }

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
      gender: createUserDto.gender,
    });

    this.logger.debug(`user[${userEntity.id}] created`, userEntity);

    try {
      const salesforceId = await this.syncCrmService.createMember(userEntity);
      userEntity.crmId = salesforceId;
      await this.userRepository.update(userEntity.id, {crmId: salesforceId});
    } catch(e) {
      this.logger.error(`fail to sync user[${userEntity.id}] to salesforce`, e);
    }

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
    const memberSeq = await this.userRepository.getMemberSequence();
    return generateSalesForceId(ENTITY_PREFIX.member, memberSeq, this.isProduction);
  }

  async updatePassword(userId: string, password: string): Promise<UserVO> {
    const userEntity = await this.userRepository.update(userId, { password });
    return this.filterUserInfo(userEntity, [ 'birthday' ]);
  }

  async updateUser(userId: string, updateData: UserUpdateDto): Promise<UserVO> {
    if (updateData.password != null) throw new BadRequestException();

    const updatedUser = await this.userRepository.update(userId, updateData);

    this.logger.debug(`user[${updatedUser.id}] updated`, updatedUser);

    try {
      const salesforceId = await this.syncCrmService.updateMember(updatedUser);
      if (salesforceId) {
        this.logger.debug(`user[${updatedUser.id}(${updatedUser.crmId})] update to salesforce`)
      } else {
        this.logger.warn(`fail to update user[${updatedUser.id}(${updatedUser.crmId})] to salesforce`);
      }
    } catch(e) {
      this.logger.error(`fail to update user[${updatedUser.id}(${updatedUser.crmId})] to salesforce`, e);
    }

    return this.filterUserInfo(updatedUser);
  }

  public async updateUserAvatar(userId: string, s3Key: string) {
    this.logger.debug(`Updating user ${userId} avatar with ${s3Key}`);
    const userEntity = await this.userRepository.update(userId, { avatarS3uri: s3Key });
    return this.filterUserInfo(userEntity);
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
    const {data, total} = await this.userRepository.findByPage(page, limit, filters);
    return {data, total, page, limit };
  }

  public delete(id: string): Promise<number> {
    return this.userRepository.delete(id);
  }

  public isExistingIdentifier(identifier: string, identifierType: IdentifierType): Promise<boolean> {
    return this.userRepository.isIdentifierExist(identifier, identifierType);
  }
}
