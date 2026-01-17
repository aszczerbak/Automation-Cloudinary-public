import { expect, type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#user_session_email');
    this.passwordInput = page.locator('#user_session_password');
    this.signInButton = page.locator('#sign-in');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://cloudinary.com/users/login');
    await expect(this.page.getByText('Log in to your account')).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}