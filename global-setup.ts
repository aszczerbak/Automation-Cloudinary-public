import { chromium, expect } from '@playwright/test';
import path from 'path';
import { getCredentials } from './src/config/credentials';
import { LoginPage } from './src/pages/LoginPage';

const AUTH_STATE_PATH = path.join(__dirname, '.auth', 'cloudinary.json');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(getCredentials.email, getCredentials.password);

  // Validate login succeeded (URL-based is usually stable)
  await expect(page).toHaveURL(/console\.cloudinary\.com\/app|console\.cloudinary\.com/i, { timeout: 15_000 });

  // Save authenticated state
  await context.storageState({ path: AUTH_STATE_PATH });

  await browser.close();
}
