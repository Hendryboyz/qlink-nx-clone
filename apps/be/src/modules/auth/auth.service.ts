import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IdentifierType,
  OtpTypeEnum,
  RegisterDto,
  ResetPasswordDto,
  User,
  UserVO,
} from '@org/types';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { isNull, omit } from 'lodash';
import axios from 'axios';

import { OtpJwtPayload } from './otp.service';
import { UserService } from '../user/user.service';
import {
  CODE_SUCCESS,
  emailRegex,
  INVALID_PAYLOAD,
  passwordRegex,
  SignupSchema,
} from '@org/common';
import { hashPassword } from '$/modules/utils/auth.util';
import { UserManagementService } from '$/modules/user/user-management.service';

type AuthSuccessBO = {
  access_token: string;
  user_id: string;
  id: string;
  email: string;
  name: string;
};

@Injectable()
export class AuthService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private userService: UserService,
    private userManagementService: UserManagementService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<AuthSuccessBO> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(`wrong credentials`);
    }

    return {
      access_token: this.signToken(email, IdentifierType.EMAIL, user.id),
      user_id: user.id,
      id: user.id,
      email: user.email,
      name: `${user.lastName} ${user.firstName}`
    };
  }

  async register(
    payload: RegisterDto,
    token: string
  ): Promise<AuthSuccessBO & { user: UserVO }> {
    const verifiedPayload: OtpJwtPayload = this.jwtService.verify(token);
    const isEmailRegistration = verifiedPayload.type === OtpTypeEnum.REGISTER &&
      this.isValidEmailIdentifier(verifiedPayload, payload.email)
    if (!isEmailRegistration) {
      throw new BadRequestException(`${verifiedPayload.identifier} is not matched.`);
    }

    this.validateRegisterPayload(payload);

    if (await this.userService.isEmailExist(payload.email)) {
      throw this.generateBadRequest(`Duplicate email: ${payload.email}`, 'email');
    }

    const hashedPassword = await hashPassword(payload.password);
    const userVO = await this.userManagementService.create(payload, hashedPassword);

    return {
      access_token: this.signToken(userVO.email, verifiedPayload.identifierType, userVO.id),
      user_id: userVO.id,
      id: userVO.id,
      email: userVO.email,
      name: `${userVO.lastName} ${userVO.firstName}`,
      user: userVO,
    };
  }

  private isValidEmailIdentifier = (jwtPayload: OtpJwtPayload, email: string) => {
    const { verified, identifier, identifierType } = jwtPayload;
    this.logger.debug(jwtPayload);
    return verified === true
      && identifier === email
      && identifierType === IdentifierType.EMAIL
      && emailRegex.test(identifier);
  }

  private generateBadRequest =
    (message: string = '', type: string) =>
      new BadRequestException({ bizCode: INVALID_PAYLOAD, data: { error: {type, message}} });

  public async isPhoneExist(phone: string): Promise<boolean> {
    const userEntity = await this.userService.findOne(phone)
    return !isNull(userEntity)
  }

  public refreshToken(userId: string, email: string) {
    return this.signToken(email, IdentifierType.EMAIL, userId)
  }

  async resetPassword(payload: ResetPasswordDto, token: string) {
    const verifiedPayload: OtpJwtPayload = this.jwtService.verify(token);

    if (
      verifiedPayload.type !== OtpTypeEnum.RESET_PASSWORD
      || !this.isValidEmailIdentifier(verifiedPayload, verifiedPayload.identifier)
    )
      throw new UnauthorizedException();

    const { password, rePassword: re_password } = payload;
    if (password != re_password || !passwordRegex.test(password)) {
      return {
        bizCode: INVALID_PAYLOAD,
        data: {
          error: {
            type: 'password',
            message: 'Invalid Password',
          },
        },
      };
    }

    const hashedPassword = await hashPassword(payload.password);
    const {identifier, identifierType} = verifiedPayload;
    const userEntity = await this.userService.findOneWithType(identifier, identifierType);
    if (isNull(userEntity)) throw new NotFoundException('Not found user');
    await this.userService.updatePassword(userEntity.id, hashedPassword);
    return {
      bizCode: CODE_SUCCESS,
      data: true
    };
  }

  async verifyRecaptcha(recaptchaToken: string): Promise<boolean> {
    const secretKey = this.config.get<string>('RECAPTCHA_SECRET_KEY');
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    try {
      const response = await axios.post(verifyUrl, null, {
        params: {
          secret: secretKey,
          response: recaptchaToken,
        },
      });
      this.logger.debug(response.data);
      return response.data.success;
    } catch (error) {
      this.logger.error('reCAPTCHA verification error:', error);
      return false;
    }
  }

  private async validateUser(
    email: string,
    password: string
  ): Promise<Partial<User> | undefined> {
    const user = await this.userService.findOneWithType(email, IdentifierType.EMAIL);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (user && isPasswordCorrect) {
      return omit(user, 'password');
    }
    return null;
  }

  private validateRegisterPayload(payload: RegisterDto) {
    SignupSchema.validateSync(payload);
    const { email = '' } = payload;
    if (email != '' && !emailRegex.test(email)) {
      throw this.generateBadRequest('Invalid email', 'email');
    }
  }

  private signToken(identifier: string, identifierType: IdentifierType, id: string): string {
    const payload = { sub: id, identifier, identifierType };
    return this.jwtService.sign(payload);
  }
}
