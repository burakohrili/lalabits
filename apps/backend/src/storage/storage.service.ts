import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const DEFAULT_PUT_EXPIRES_IN = 300;  // 5 minutes
const DEFAULT_GET_EXPIRES_IN = 3600; // 60 minutes

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.getOrThrow<string>('STORAGE_BUCKET');

    this.client = new S3Client({
      endpoint: this.config.getOrThrow<string>('STORAGE_ENDPOINT'),
      region: this.config.getOrThrow<string>('STORAGE_REGION'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('STORAGE_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>('STORAGE_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true, // required for non-AWS S3-compatible providers
    });
  }

  async getPresignedPutUrl(
    key: string,
    contentType: string,
    expiresIn: number = DEFAULT_PUT_EXPIRES_IN,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.client, command, { expiresIn });
    this.logger.debug(`Presigned PUT URL generated for key: ${key}`);
    return url;
  }

  async getSignedGetUrl(
    key: string,
    expiresIn: number = DEFAULT_GET_EXPIRES_IN,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.client, command, { expiresIn });
    this.logger.debug(`Signed GET URL generated for key: ${key}`);
    return url;
  }
}
