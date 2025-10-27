import {
  BadRequestException,
  Logger,
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserId } from '$/decorators/userId.decorator';
import { UserService } from './user.service';
import { UserUpdateDto } from '@org/types';
import {
  imageFileFilter,
  imageStorage,
} from '$/modules/utils/file-upload.util';
import { TransformInterceptor } from '$/interceptors/response.interceptor';
import { S3storageService } from '$/modules/upload/s3storage.service';
import { UserManagementService } from '$/modules/user/user-management.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  private logger = new Logger(this.constructor.name);
  private readonly bucketName: string;
  private readonly cdnHostname: string;
  constructor(
    private userService: UserService,
    private userManagementService: UserManagementService,
    private configService: ConfigService,
    private storageService: S3storageService
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    this.cdnHostname = this.configService.get<string>(
      'AWS_CLOUDFRONT_HOSTNAME'
    );
  }

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

  @Put('/info')
  async updateInfo(
    @UserId() userId: string,
    @Body() payload: UserUpdateDto,
  ) {
    return this.userManagementService.updateUser(userId, payload);
  }

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

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@UserId() userId: string): Promise<void> {
    await this.userManagementService.softDelete(userId);
  }
}

