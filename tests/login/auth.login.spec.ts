import { expect, test } from '@playwright/test';
import { getCredentials } from '../../src/config/credentials';
import { LoginPage } from '../../src/pages/LoginPage';

/**
 * TC ID: TC001-Login-CredentialsVerification
 * Title: Login with credentials and verify Home is visible
 *
 * Description:
 * Verifies that a user can successfully log in to Cloudinary Console using valid credentials
 * and that the Home page is displayed after authentication.
 *
 * Steps:
 * 1) Navigate to Cloudinary login page
 * 2) Enter valid email and password
 * 3) Click login button
 * 4) Verify "Home" text is visible (confirming successful login)
 */
test.describe('Cloudinary - login', () => {
  test('Login with credentials and verify Home is visible', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Step 1-3: Navigate and login
    await loginPage.goto();
    await loginPage.login(getCredentials.email, getCredentials.password);

    // Step 4: Verify Home is visible
    await expect(page.getByText('Home')).toBeVisible();
  });
});
