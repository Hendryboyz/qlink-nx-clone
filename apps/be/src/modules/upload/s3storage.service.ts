import { Injectable, Logger } from '@nestjs/common';
import {
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { fromInstanceMetadata } from '@aws-sdk/credential-providers';
import fs from 'node:fs';

@Injectable()
export class S3storageService {
  private logger: Logger = new Logger(this.constructor.name);
  private readonly bucketName: string;
  private readonly s3Client: S3Client;

    constructor(private configService: ConfigService) {
      this.s3Client = new S3Client({
        region: this.configService.get<string>('AWS_S3_REGION'),
        credentials: this.getAWSCredentials(),
      });
      this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
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

  public async putTemporaryObject(filePath: string, fileName: string, mimeType?: string) {
    // Upload file to S3
    const serverPath = filePath;
    const s3Key = `tmp/${fileName}`;
    const fileStream = fs.createReadStream(serverPath);
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: fileStream,
        ContentType: mimeType,
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

  public async moveObject(sourcePath: string, destinationPath: string) {
      try {
        const copyCmd = new CopyObjectCommand({
          Bucket: this.bucketName,
          CopySource: `${this.bucketName}/${sourcePath}`,
          Key: destinationPath,
        });
        await this.s3Client.send(copyCmd);
        this.logger.debug(`Move ${this.bucketName} object from ${sourcePath} to ${destinationPath}`);

        const deleteCmd = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: sourcePath,
        });
        await this.s3Client.send(deleteCmd);
        this.logger.debug(`Delete original object ${sourcePath} in ${this.bucketName}`);

        return destinationPath;
      } catch (error) {
        this.logger.error(`Fail to move object to ${destinationPath}: ${error.message}`);
        throw error;
      }
  }
}
