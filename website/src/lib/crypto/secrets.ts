import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * AES-256-GCM encryption pra tokens de cliente (Meta long-lived access token).
 * Formato output: `<iv:base64>:<authTag:base64>:<ciphertext:base64>`
 *
 * ENCRYPTION_KEY: 32 bytes (256 bits) em hex (64 chars). Gera com: openssl rand -hex 32
 */
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // GCM standard

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex) throw new Error("Missing env var: ENCRYPTION_KEY (32 bytes hex)");

  const key = Buffer.from(hex, "hex");
  if (key.length !== 32) {
    throw new Error(`ENCRYPTION_KEY deve ter 32 bytes (64 hex chars), tem ${key.length}`);
  }
  return key;
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decrypt(payload: string): string {
  const key = getKey();
  const parts = payload.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted payload format");

  const [ivB64, tagB64, ctB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(ctB64, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}
