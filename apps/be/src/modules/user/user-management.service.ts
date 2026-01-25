import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { filterUserInfo } from '$/modules/user/user.utils';
import { UserRepository } from '$/modules/user/user.repository';
import { RegisterDto, UserEntity, UserUpdateDto, UserVO } from '@org/types';
import {
  AppEnv,
  ENTITY_PREFIX,
  generateSalesForceId,
} from '$/modules/utils/auth.util';
import { omit } from 'lodash';
import { ProductService } from '$/modules/product/product.service';
import { CrmService } from '$/modules/crm/crm.service';

@Injectable()
export class UserManagementService {
  private logger = new Logger(this.constructor.name);
  private readonly envPrefix: AppEnv = AppEnv.development;

  constructor(
    private readonly configService: ConfigService,
    private readonly crmService: CrmService,
    private readonly productService: ProductService,
    private readonly userRepository: UserRepository
  ) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    this.envPrefix = AppEnv[nodeEnv];
  }

  public async create(
    createUserDto: RegisterDto,
    hashedPassword: string
  ): Promise<UserVO> {
    const userEntity = await this.userRepository.create({
      ...omit(createUserDto, ['password', 'rePassword']),
      password: hashedPassword,
      memberId: await this.generateMemberId(),
      gender: createUserDto.gender,
    });

    this.logger.debug(`user[${userEntity.id}] created`, userEntity);

    try {
      await this.createMemberToCRM(userEntity);
    } catch (error) {
      this.logger.error(
        `fail to sync CRM after user[${userEntity.id}] created`
      );
    }

    return {
      ...omit(userEntity, ['createdAt', 'updatedAt', 'isDelete', 'password']),
    };
  }

  private async generateMemberId() {
    const memberSeq = await this.userRepository.getMemberSequence();
    return generateSalesForceId(
      ENTITY_PREFIX.member,
      memberSeq,
      this.envPrefix
    );
  }

  private async createMemberToCRM(user: UserEntity): Promise<string> {
    if (user.crmId) {
      return user.crmId;
    }
    try {
      const salesforceId = await this.crmService.syncMember(user);
      this.logger.debug(salesforceId);
      user.crmId = salesforceId;
      await this.userRepository.update(user.id, {crmId: salesforceId});
      return salesforceId;
    } catch(error) {
      this.logger.error(`fail to sync user[${user.id}] to salesforce`, error);
      throw error;
    }
  }

  public async updateUser(
    userId: string,
    updateData: UserUpdateDto,
  ): Promise<UserVO> {
    this.logger.debug(`user[${userId}] updating`, updateData);
    if (updateData.password) {
      throw new BadRequestException(
        'not allow to update password with user profile'
      );
    }
    const updatedUser = await this.userRepository.update(userId, updateData);

    this.logger.debug(`user[${updatedUser.id}] updated`, updatedUser);

    try {
      const salesforceId = await this.crmService.syncMember(updatedUser);
      if (salesforceId) {
        this.logger.debug(
          `user[${updatedUser.id}(${updatedUser.crmId})] update to salesforce`
        );
      } else {
        this.logger.warn(
          `fail to update user[${updatedUser.id}(${updatedUser.crmId})] to salesforce`
        );
      }
    } catch (e) {
      this.logger.error(
        `fail to update user[${updatedUser.id}(${updatedUser.crmId})] to salesforce`,
        e
      );
    }

    return filterUserInfo(updatedUser);
  }

  public async patchUserEmail(
    userId: string,
    newUserEmail: string
  ): Promise<UserVO> {
    return await this.updateUser(userId, { email: newUserEmail });
  }

  public async delete(id: string): Promise<void> {
    const userEntity = await this.userRepository.findById(id);
    if (!userEntity) {
      throw new NotFoundException(`user[${id}] not found`);
    }

    const unlinkedRows = await this.productService.unlinkAllOwnedProduct(
      userEntity.id
    );
    this.logger.debug(
      `products owned by user[${userEntity.id}] soft deleted: ${unlinkedRows}`
    );
    if (userEntity.crmId) {
      await this.crmService.deleteMember(userEntity);
    }
    await this.userRepository.removeById(id);
  }


  // logic to sync CRM
  public async reSyncCRM(): Promise<number> {
    const unSyncUsers = await this.userRepository.findCrmNotCreated();
    if (!unSyncUsers || unSyncUsers.length < 1) {
      return 0;
    }

    let succeed = 0,
      failure = 0;
    for (const user of unSyncUsers) {
      try {
        await this.createMemberToCRM(user);
        this.logger.debug(
          'Resync user to CRM successfully',
          JSON.stringify(user)
        );
        succeed++;
      } catch (e) {
        this.logger.error(`fail to reSync user to CRM`, e);
        failure++;
      }
    }
    this.logger.log(
      `Re sync ${unSyncUsers.length} users to CRM, succeed: ${succeed}, failure: ${failure}`
    );
    return succeed;
  }

  public async syncCRMByUserId(userId: string): Promise<string> {
    const userEntity = await this.userRepository.findById(userId);
    this.logger.debug(userId, userEntity);
    if (!userEntity) {
      throw new BadRequestException('User not found');
    }

    return this.createMemberToCRM(userEntity);
  }
}
