# Cloudinary Automation Tests

Automated UI and API tests for Cloudinary built with Playwright and TypeScript. This suite was created to practice and solidify skills around end-to-end automation, focusing on upload presets, delivery options, and related workflows.

## Prerequisites

- Node.js 18+ and npm
- A Cloudinary account: https://cloudinary.com

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root with your Cloudinary credentials:
   ```
   CLOUDINARY_LOGIN=<your_cloudinary_login_or_email>
   CLOUDINARY_PASSWORD=<your_cloudinary_password>
   CLOUDINARY_API_KEY=<your_api_key>
   CLOUDINARY_API_SECRET=<your_api_secret>
   CLOUDINARY_CLOUD_NAME=<your_cloud_name>
   ```
3. (Optional) Adjust Playwright settings in `playwright.config.ts` (browsers, timeouts, reporter, etc.).

## Running Tests

- Run the full suite:
  ```bash
  npx playwright test
  ```
- Run a specific area (example: upload presets):
  ```bash
  npx playwright test tests/cloudinary/uploadPresets
  ```
- Debug in headed mode:
  ```bash
  npx playwright test --headed --debug
  ```

## Project Structure

- `tests/cloudinary/` — Playwright specs grouped by feature (upload presets, login, upload, E2E, API).
- `src/pages/` — Page Object Model helpers used by the specs.
- `src/selectors/` — Centralized locators.
- `src/config/` — Cloudinary API/config utilities.
- `global-setup.ts` / `global-teardown.ts` — Optional suite-wide setup/cleanup.

## Notes

- Tests assume valid Cloudinary credentials and permissions to create/delete upload presets and assets.
- API cleanups are included to minimize leftover presets and artifacts.
