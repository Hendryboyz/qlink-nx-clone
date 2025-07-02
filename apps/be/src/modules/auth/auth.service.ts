import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  IdentifierType,
  OtpTypeEnum,
  RegisterDto,
  ResetPasswordDto,
  User,
  UserSourceType,
  UserType,
  UserVO,
} from '@org/types';

import * as bcrypt from 'bcrypt';
import { isNull, omit } from 'lodash';
import axios from 'axios';
import { OtpJwtPayload } from './otp.service';
import {
  alphaMax50Regex,
  birthdayRegex,
  CODE_SUCCESS,
  emailRegex,
  INVALID_PAYLOAD,
  passwordRegex,
  phoneRegex,
} from '@org/common';
import { ConfigService } from '@nestjs/config';

type AuthSuccessBO = {
  access_token: string;
  user_id: string;
};

@Injectable()
export class AuthService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private userService: UserService,
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
    };
  }

  async register(
    payload: RegisterDto,
    token: string
  ): Promise<AuthSuccessBO & { user: UserVO }> {
    // 1. verify token
    const verifiedPayload: OtpJwtPayload = this.jwtService.verify(token);
    if (
      verifiedPayload.type !== OtpTypeEnum.REGISTER ||
      ! this.isValidEmailIdentifier(verifiedPayload, payload.email)
    ) {
      throw new BadRequestException(`${verifiedPayload.identifier} is not matched.`);
    }

    this.validateRegisterPayload(payload);

    if (await this.userService.isEmailExist(payload.email)) {
      throw this.generateBadRequest(`Duplicate email: ${payload.email}`, 'email');
    }

    const hashedPassword = await this.hashedPassword(payload.password);
    const userVO = await this.userService.create(payload, hashedPassword);
    // 在實際應用中,您需要發送OTP給用戶(例如通過電子郵件或短信)
    return {
      access_token: this.signToken(userVO.email, verifiedPayload.identifierType, userVO.id),
      user_id: userVO.id,
      user: userVO,
    };
  }

  private isValidEmailIdentifier = (jwtPayload: OtpJwtPayload, email: string) => {
    const { verified, identifier, identifierType } = jwtPayload;
    return verified === true
      && identifier === email
      && identifierType === IdentifierType.EMAIL
      && emailRegex.test(identifier);
  }

  private generateBadRequest =
    (message: string = '', type: string) =>
      new BadRequestException({ bizCode: INVALID_PAYLOAD, data: { error: {type, message}} });

  async isPhoneExist(phone: string): Promise<boolean> {
    const userEntity = await this.userService.findOne(phone)
    return !isNull(userEntity)
  }

  refreshToken(userId: string, phone: string) {
    return this.signToken(phone, IdentifierType.PHONE, userId)
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

    const hashedPassword = await this.hashedPassword(payload.password);
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
    // need to remove
    return true;
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
    const {
      phone,
      type,
      password,
      rePassword,
      firstName: first_name,
      midName: mid_name = '',
      lastName: last_name,
      addressCity: address_city,
      addressState: address_state,
      addressDetail: address_detail = '',
      birthday = '',
      source = NaN,
      email = '',
      whatsapp = '',
      facebook = '',
    } = payload;

    if (!phoneRegex.test(phone)) throw this.generateBadRequest('Invalid phone', 'phone');
    if (!Object.values(UserType).includes(type)) throw this.generateBadRequest('Invalid user-type', 'type');
    if (!passwordRegex.test(password)) throw this.generateBadRequest('Invalid password', 'password');
    if (password !== rePassword) throw this.generateBadRequest('Unconfirmed password', 're_password');

    // ! need improvement
    if (
      !alphaMax50Regex.test(first_name)
      ||!alphaMax50Regex.test(last_name)
      ||(mid_name !== '' && !alphaMax50Regex.test(mid_name))
    )
      throw this.generateBadRequest('Invalid name', 'first_name');

    if (
      !alphaMax50Regex.test(address_city) ||
      !alphaMax50Regex.test(address_state) ||
      (address_detail !== '' && !alphaMax50Regex.test(address_detail))
    )
      throw this.generateBadRequest('Invalid address', 'address_city');

    if (birthday != '' && !birthdayRegex.test(birthday))
      throw this.generateBadRequest('Invalid birthday', 'birthday');

    this.logger.debug(source, Object.values(UserSourceType).includes(source));
    if (
      !Number.isNaN(source) &&
      !Object.values(UserSourceType).includes(source)
    )
      throw this.generateBadRequest('Invalid source', 'source');

    if (email != '' && !emailRegex.test(email))
      throw this.generateBadRequest('Invalid email', 'email');
    // whatsapp
    // facebook
  }

  private signToken(identifier: string, identifierType: IdentifierType, id: string): string {
    const payload = { sub: id, identifier, identifierType };
    return this.jwtService.sign(payload);
  }
  private async hashedPassword(password: string): Promise<string> {
    const PasswordSalt = 10;
    return await bcrypt.hash(password, PasswordSalt);
  }
}
