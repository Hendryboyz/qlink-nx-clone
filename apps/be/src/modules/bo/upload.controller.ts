import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { S3storageService } from '$/modules/upload/s3storage.service';
import { TransformInterceptor } from '$/interceptors/response.interceptor';
import { imageFileFilter, imageStorage } from '$/modules/utils/file-upload.util';
import { ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';

class UploadPostImageResponse {
  @ApiResponseProperty()
  s3Uri: string;

  @ApiResponseProperty()
  imageUrl: string;
}

@ApiTags("Bo Uploads")
@Controller('upload')
export class UploadController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  private readonly bucketName: string;
  private readonly cdnHostname: string;

  constructor(
    private configService: ConfigService,
    private storageService: S3storageService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    this.cdnHostname = this.configService.get<string>('AWS_CLOUDFRONT_HOSTNAME');
  }


  @ApiResponse({type: UploadPostImageResponse, status: HttpStatus.CREATED})
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: imageStorage,
      fileFilter: imageFileFilter,
    }),
    TransformInterceptor
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadPostImageResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const s3Key: string = await this.storageService.putTemporaryObject(
        file.path, file.filename, file.mimetype);

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
