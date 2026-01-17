import { requiredEnv } from '../utils/env';

export const cloudinaryApiConfig = {
  cloudName: requiredEnv('CLOUDINARY_CLOUD_NAME'),
  apiKey: requiredEnv('CLOUDINARY_API_KEY'),
  apiSecret: requiredEnv('CLOUDINARY_API_SECRET'),
};
