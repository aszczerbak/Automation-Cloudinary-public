import * as dotenv from 'dotenv';
import path from 'path';

let loaded = false;

function ensureEnvLoaded(): void {
  if (loaded) return;

  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  loaded = true;
}

export function requiredEnv(name: string): string {
  ensureEnvLoaded();

  const value = process.env[name];
  if (!value) {
    // show keys only (safe), not values
    const keys = Object.keys(process.env).filter(k => k.includes('CLOUDINARY'));
    throw new Error(
      `Missing required environment variable: ${name}. Found CLOUDINARY keys: ${keys.join(', ') || '(none)'}`
    );
  }
  return value;
}
