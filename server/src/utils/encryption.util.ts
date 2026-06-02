import crypto from 'crypto';

const algorithm = 'aes-256-gcm';

export function hashText(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function encryptText(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    crypto.scryptSync(key, 'vyra-salt', 32),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}
