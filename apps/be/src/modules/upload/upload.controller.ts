import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile, BadRequestException, Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, imageStorage } from '../utils/file-upload.util';
import { TransformInterceptor } from '$/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromInstanceMetadata } from "@aws-sdk/credential-providers";
import * as fs from 'node:fs';

@Controller('upload')
export class UploadController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  private readonly bucketName: string;
  private readonly s3Client: S3Client;
  private readonly cdnHostname: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION'),
      credentials: this.getAWSCredentials(),
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    this.cdnHostname = this.configService.get<string>('AWS_CLOUDFRONT_HOSTNAME');
  }

  private getAWSCredentials() {
    if (process.env.NODE_ENV === 'production') {
      return fromInstanceMetadata();
    } else {
      return {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY'
        ),
      };
    }
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: imageStorage,
      fileFilter: imageFileFilter,
    }),
    TransformInterceptor
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const s3Key: string = await this.uploadToS3(file);

      return {
        s3Uri: `s3://${this.bucketName}/${s3Key}`,
        imageUrl: `${this.cdnHostname}/${s3Key}`,
      };
    } catch (error) {
      this.logger.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file');
    }
  }

  private async uploadToS3(file: Express.Multer.File) {
    // Upload file to S3
    const serverPath = file.path;
    const s3Key = `tmp/${file.filename}`;
    const fileStream = fs.createReadStream(serverPath);
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: fileStream,
        ContentType: file.mimetype,
      })
    );

    // Remove file from local storage
    fs.unlink(serverPath, (err) => {
      if (!err) {
        return;
      }
      this.logger.error(`Fail to delete: ${err.message}`);
    });

    return s3Key;
  }
}
