import {
  BadRequestException,
  Body,
  Controller,
  Get, Headers,
  Logger,
  Post,
  Put, Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from '$/decorators/userId.decorator';
import { UserService } from './user.service';
import { RegisterDto, UserUpdateDto } from '@org/types';
import {
  imageFileFilter,
  imageStorage,
} from '$/modules/utils/file-upload.util';
import { TransformInterceptor } from '$/interceptors/response.interceptor';
import { S3storageService } from '$/modules/upload/s3storage.service';
import { ConfigService } from '@nestjs/config';
import { CODE_SUCCESS, HEADER_PRE_TOKEN, INVALID_PAYLOAD } from '@org/common';
import { Response } from 'express';
import { hashPassword } from '$/modules/utils/auth.util';

@Controller('user')
export class UserController {
  private logger = new Logger(this.constructor.name);
  private readonly bucketName: string;
  private readonly cdnHostname: string;
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private storageService: S3storageService
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    this.cdnHostname = this.configService.get<string>(
      'AWS_CLOUDFRONT_HOSTNAME'
    );
  }

  @Post('')
  async postUser(
    @Body() payload: RegisterDto,
  ) {
    if (await this.userService.isEmailExist(payload.email)) {
      throw new BadRequestException({
        bizCode: INVALID_PAYLOAD,
        data: {
          error: {
            type: 'email',
            message: `Duplicate email: ${payload.email}`,
          },
        },
      });
    }

    const hashedPassword = await hashPassword(payload.password);
    return await this.userService.create(payload, hashedPassword);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/info')
  async getInfo(@UserId() userId: string) {
    const user = await this.userService.getUserInfo(userId);
    const { avatarS3Uri } = user;
    if (user.avatarS3Uri) {
      user.avatarImageUrl =
        `${this.cdnHostname}/` + avatarS3Uri.slice(`${this.bucketName}/`.length);
      this.logger.debug(user.avatarImageUrl);
    }
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/info')
  async updateInfo(@UserId() userId: string, @Body() payload: UserUpdateDto) {
    return this.userService.updateUser(userId, payload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: imageStorage,
      fileFilter: imageFileFilter,
    }),
    TransformInterceptor
  )
  async uploadAvatar(
    @UserId() userId: string,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    if (!avatar) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const s3Key: string = await this.storageService.putObject(
        userId,
        avatar.path,
        avatar.filename,
        avatar.mimetype
      );

      await this.userService.updateUserAvatar(
        userId,
        `${this.bucketName}/${s3Key}`
      );

      return {
        s3Uri: `s3://${this.bucketName}/${s3Key}`,
        imageUrl: `${this.cdnHostname}/${s3Key}`,
      };
    } catch (error) {
      this.logger.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file');
    }
  }
}
