import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly keyHex: string;

  constructor(private readonly configService: ConfigService) {
    this.keyHex = this.configService.get<string>('ENCRYPTION_KEY', '');
    if (!this.keyHex || !/^[0-9a-fA-F]{64}$/.test(this.keyHex)) {
      this.logger.warn(
        'ENCRYPTION_KEY is missing or invalid. Encrypted fields will not work. ' +
        'Generate with: openssl rand -hex 32',
      );
    }
  }

  encrypt(plain: string): string {
    const key = Buffer.from(this.keyHex, 'hex');
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return [iv.toString('hex'), authTag.toString('hex'), ciphertext.toString('hex')].join(':');
  }

  decrypt(encrypted: string): string {
    const parts = encrypted.split(':');
    if (parts.length !== 3) throw new Error('Invalid encrypted field format');
    const [ivHex, authTagHex, ciphertextHex] = parts;
    const key = Buffer.from(this.keyHex, 'hex');
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'), { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    return decipher.update(Buffer.from(ciphertextHex, 'hex')).toString('utf8') + decipher.final('utf8');
  }
}
