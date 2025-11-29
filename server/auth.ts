import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
};

export async function hash(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 32, SCRYPT_OPTIONS).toString("hex");
  return `${salt}.${derived}`;
}

export async function verify(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(".");
  if (!salt || !key) return false;
  
  try {
    const derived = scryptSync(password, salt, 32, SCRYPT_OPTIONS).toString("hex");
    return timingSafeEqual(Buffer.from(derived), Buffer.from(key));
  } catch {
    return false;
  }
}
