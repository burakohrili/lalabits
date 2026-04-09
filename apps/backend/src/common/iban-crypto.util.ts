import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV — standard for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a plain-text IBAN using AES-256-GCM.
 * Returns a colon-separated string: iv_hex:authTag_hex:ciphertext_hex
 * The encryption key must be a 64-character hex string (32 bytes).
 */
export function encryptIban(plain: string, keyHex: string): string {
  assertValidKey(keyHex);
  const key = Buffer.from(keyHex, 'hex');
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  const ciphertext = Buffer.concat([
    cipher.update(plain, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString('hex'),
    authTag.toString('hex'),
    ciphertext.toString('hex'),
  ].join(':');
}

/**
 * Decrypts an AES-256-GCM ciphertext produced by encryptIban.
 * Throws if the key is invalid or authentication fails.
 */
export function decryptIban(encrypted: string, keyHex: string): string {
  assertValidKey(keyHex);
  const parts = encrypted.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted IBAN format');
  }
  const [ivHex, authTagHex, ciphertextHex] = parts;
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const ciphertext = Buffer.from(ciphertextHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);
  return (
    decipher.update(ciphertext).toString('utf8') + decipher.final('utf8')
  );
}

function assertValidKey(keyHex: string): void {
  if (!/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error(
      'IBAN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes). ' +
        'Generate one with: openssl rand -hex 32',
    );
  }
}
