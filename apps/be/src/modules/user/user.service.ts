import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RegisterDto, UserEntity, UserUpdateDto, UserVO } from '@org/types';
import { UserRepository } from './user.repository';
import { omit } from 'lodash';

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

  async getUserInfo(userId: string): Promise<UserVO | undefined> {
    const user = await this.userRepository.findById(userId)
    return this.filterUserInfo(user);
  }

  private filterUserInfo(user: UserEntity, additionOmitFields: UserOmitFields[] = []): UserVO | undefined {
    return {
      ...omit(user, ['isDelete', 'createdAt', 'updatedAt', 'password', ...additionOmitFields]),
    }
  }

  // async findById(id: string): Promise<User | undefined> {
  //   return this.userRepository.findOne({ where: { id } });
  // }

  async isEmailExist(email: string): Promise<boolean> {
    return await this.userRepository.isEmailExist(email);
  }

  async create(createUserDto: RegisterDto, hashedPassword: string): Promise<UserVO> {
    const userEntity = await this.userRepository.create({
     ...omit(createUserDto, ['password', 'rePassword']),
      password: hashedPassword,
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

//   async setOtp(userId: number, otp: string): Promise<void> {
//     await this.userRepository.update(userId, { otp });
//   }

//   async verifyOtp(userId: number, otp: string): Promise<boolean> {
//     const user = await this.findById(userId);
//     if (user && user.otp === otp) {
//       await this.userRepository.update(userId, { isVerified: true, otp: null });
//       return true;
//     }
//     return false;
//   }

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
    const userEntity = await this.userRepository.update(userId, { avatarS3Uri: s3Key });
    return this.filterUserInfo(userEntity);
  }
}
