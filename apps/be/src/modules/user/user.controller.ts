import {
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserId } from '$/decorators/userId.decorator';
import { UserService } from './user.service';
import { UserUpdateDto, UserVO } from '@org/types';
import {
  imageFileFilter,
  imageStorage,
} from '$/modules/utils/file-upload.util';
import { TransformInterceptor } from '$/interceptors/response.interceptor';
import { S3storageService } from '$/modules/upload/s3storage.service';
import { UserManagementService } from '$/modules/user/user-management.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserProfileResponse } from '$/modules/user/user.dto';

type UploadS3Response = {
  s3Uri: string;
  imageUrl: string;
};

@ApiTags("QRC User")
@ApiBearerAuth()
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

  @ApiResponse({status: HttpStatus.OK, type: GetUserProfileResponse})
  @Get('/info')
  async getInfo(@UserId() userId: string): Promise<GetUserProfileResponse> {
    const user: UserVO = await this.userService.getUserInfo(userId);
    const { avatarS3Uri, coverImageS3Uri } = user;
    this.logger.debug(avatarS3Uri, coverImageS3Uri, user);
    if (avatarS3Uri) {
      user.avatarImageUrl =
        `${this.cdnHostname}/` + avatarS3Uri.slice(`${this.bucketName}/`.length);
    }

    if (coverImageS3Uri) {
      user.coverImageUrl =
        `${this.cdnHostname}/` + coverImageS3Uri.slice(`${this.bucketName}/`.length);
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
  ): Promise<UploadS3Response> {
    if (!avatar) {
      throw new BadRequestException('No file uploaded');
    }

    const s3Key: string = await this.uploadS3(userId, avatar);

    await this.userService.updateUserMediaFile(
      userId,
      {
        avatar: `${this.bucketName}/${s3Key}`,
      },
    );

    return this.buildUploadS3Response(s3Key);
  }

  private uploadS3(userId: string, media: Express.Multer.File) {
    try {
      return this.storageService.putObject(
        userId,
        media.path,
        media.filename,
        media.mimetype
      );
    } catch (error) {
      this.logger.error('Error uploading to S3:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  private buildUploadS3Response(s3Key: string): UploadS3Response {
    return {
      s3Uri: `s3://${this.bucketName}/${s3Key}`,
      imageUrl: `${this.cdnHostname}/${s3Key}`,
    };
  }

  @Post('/cover')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: imageStorage,
      fileFilter: imageFileFilter,
    }),
    TransformInterceptor
  )
  async uploadCover(
    @UserId() userId: string,
    @UploadedFile() cover: Express.Multer.File
  ): Promise<UploadS3Response> {
    if (!cover) {
      throw new BadRequestException('No file uploaded');
    }

    const s3Key: string = await this.storageService.putObject(
      userId,
      cover.path,
      cover.filename,
      cover.mimetype
    );

    await this.userService.updateUserMediaFile(
      userId,
      {
        cover: `${this.bucketName}/${s3Key}`,
      },
    );

    return this.buildUploadS3Response(s3Key);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@UserId() userId: string): Promise<void> {
    await this.userManagementService.delete(userId);
  }
}

