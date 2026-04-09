import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
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
  private _client: S3Client | null = null;
  private _bucket: string | null = null;

  constructor(private readonly config: ConfigService) {}

  private get client(): S3Client {
    if (!this._client) {
      const endpoint = this.config.get<string>('STORAGE_ENDPOINT');
      const region = this.config.get<string>('STORAGE_REGION');
      const accessKeyId = this.config.get<string>('STORAGE_ACCESS_KEY_ID');
      const secretAccessKey = this.config.get<string>('STORAGE_SECRET_ACCESS_KEY');

      if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
        throw new InternalServerErrorException('Storage is not configured');
      }

      this._client = new S3Client({
        endpoint,
        region,
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true,
      });
    }
    return this._client;
  }

  private get bucket(): string {
    if (!this._bucket) {
      const bucket = this.config.get<string>('STORAGE_BUCKET');
      if (!bucket) throw new InternalServerErrorException('Storage is not configured');
      this._bucket = bucket;
    }
    return this._bucket;
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
