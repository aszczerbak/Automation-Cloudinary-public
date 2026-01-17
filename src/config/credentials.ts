import { requiredEnv } from '../utils/env';

export const getCredentials = {
  email: requiredEnv('CLOUDINARY_EMAIL'),
  password: requiredEnv('CLOUDINARY_PASSWORD'),
};