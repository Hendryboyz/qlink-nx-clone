import {
  Controller,
  UseGuards,
  Get,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException, Post, Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from '$/decorators/userId.decorator';
import { UserService } from './user.service';
import { UserUpdateDto } from '@org/types';
import { imageFileFilter, imageStorage } from '$/modules/utils/file-upload.util';
import { TransformInterceptor } from '$/interceptors/response.interceptor';
import { S3storageService } from '$/modules/upload/s3storage.service';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  private logger = new Logger(this.constructor.name);
  private readonly bucketName: string;
  private readonly cdnHostname: string;
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private storageService: S3storageService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    this.cdnHostname = this.configService.get<string>('AWS_CLOUDFRONT_HOSTNAME');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/info')
  async getInfo(@UserId() userId: string) {
    return this.userService.getUserInfo(userId);
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
  async uploadAvatar(@UserId() userId: string, @UploadedFile() avatar: Express.Multer.File) {
    if (!avatar) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const s3Key: string = await this.storageService.putObject(
        userId,
        avatar.path,
        avatar.filename,
        avatar.mimetype,
      );

      await this.userService.updateUserAvatar(userId, `${this.bucketName}/${s3Key}`);

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
