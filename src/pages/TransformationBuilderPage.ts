/**
 * TransformationBuilderPage - Page Object Model for Cloudinary Transformation Builder
 *
 * Encapsulates all interactions with the Transformation Builder UI, providing a clean
 * API for test automation. This page handles:
 * - Applying resize transformations (Scale, Fit, Fill, Crop, etc.)
 * - Saving transformations with custom names
 * - Navigating between builder and saved transformation list
 * - Verifying transformation parameters and image dimensions
 * - Deleting transformations for cleanup
 *
 * @example
 * const tb = new TransformationBuilderPage(page);
 * await tb.goto();
 * await tb.applyResize('Scale', 500, 500);
 * await tb.saveAs('my_transformation');
 */
import { expect, type Locator, type Page } from '@playwright/test';
import { TransformationBuilder as S } from '../selectors/transformationBuilder.selectors';

export class TransformationBuilderPage {
  constructor(readonly page: Page) {}

  /**
   * Navigate to the Transformation Builder page
   */
  async goto(): Promise<void> {
    await this.page.goto(S.url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Apply a resize transformation with specified dimensions
   * @param actionName - Name of the resize action (e.g., 'Scale', 'Fit', 'Fill')
   * @param width - Target width in pixels
   * @param height - Target height in pixels
   */
  async applyResize(actionName: string, width: number, height: number): Promise<void> {
    await S.resizeMenuItem(this.page, actionName).click();
    await S.widthInput(this.page).fill(String(width));
    await S.heightInput(this.page).fill(String(height));
    await S.applyButton(this.page).click();
  }

  /**
   * Save the current transformation with a custom name
   * @param name - Name for the transformation
   */
  async saveAs(name: string): Promise<void> {
    await S.saveAsButton(this.page).click();
    await expect(S.saveModal(this.page)).toBeVisible({ timeout: 20_000 });

    await S.saveNameInput(this.page).fill(name);
    await S.saveButton(this.page).click();

    await expect(S.banner(this.page)).toContainText('The named transformation saved successfully', {
      timeout: 20_000,
    });
  }

  /**
   * Close the builder panel to show the saved transformations list
   */
  async openSavedList(): Promise<void> {
    await S.closeBuilderButton(this.page).click();
  }

  /**
   * Get a locator for a transformation card by name
   * @param name - Name of the transformation
   * @returns Locator for the transformation card
   */
  card(name: string): Locator {
    return S.transformationCard(this.page, name);
  }

  /**
   * Open a saved transformation card to view its details
   * @param name - Name of the transformation
   * @returns Locator for the opened card
   */
  async openCard(name: string): Promise<Locator> {
    const card = this.card(name);
    await expect(card).toBeVisible({ timeout: 20_000 });
    await card.click();

    // Wait for detail view to load
    await expect(S.showParametersButton(this.page)).toBeVisible({ timeout: 20_000 });

    return card;
  }

  /**
   * Click the "Show Parameters" button to reveal transformation parameters
   */
  async showParameters(): Promise<void> {
    const btn = S.showParametersButton(this.page);
    await expect(btn).toBeVisible({ timeout: 20_000 });
    await btn.click({ force: true });

    // Wait for code snippets panel to load by checking for Cloudinary URL
    await expect(S.cloudinaryUrlLink(this.page)).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Verify that the transformation parameters contain expected text
   * @param text - Expected parameter text (e.g., 'c_scale,h_500,w_500/')
   */
  async expectParamsContains(text: string): Promise<void> {
    // Wait for parameters to be visible with increased timeout
    await expect(S.root(this.page)).toContainText(text, { timeout: 10_000 });
  }

  /**
   * Extract the transformed image URL from the UI
   * @param width - Expected width parameter
   * @param height - Expected height parameter
   * @param name - Transformation name
   * @returns The complete Cloudinary image URL
   */
  async getTransformedImageUrl(width: number, height: number, name: string): Promise<string> {
    // Wait for any Cloudinary link to appear first
    await expect(S.cloudinaryUrlLink(this.page)).toBeVisible({ timeout: 10_000 });

    const urlLocator = S.transformedImageUrl(this.page, width, height, name);
    await expect(urlLocator, 'No matching transformed URL (w/h or t_name) found in UI').toBeVisible({
      timeout: 20_000,
    });

    const href = await urlLocator.getAttribute('href');
    expect(href, 'No href attribute found on transformed image URL link').toBeTruthy();

    // TypeScript safety: href is truthy at this point due to the expect above
    if (!href) {
      throw new Error('href is unexpectedly null despite passing expect check');
    }
    return href;
  }

  /**
   * Load an image and return its actual dimensions
   * @param imageUrl - URL of the image to load
   * @returns Object containing width and height in pixels
   */
  async getImageSize(imageUrl: string): Promise<{ width: number; height: number }> {
    return await this.page.evaluate(async (src) => {
      return await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        img.onload = (): void => {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = (): void => {
          reject(new Error(`Image failed to load: ${src}`));
        };
        img.src = src + (src.includes('?') ? '&' : '?') + `cb=${String(Date.now())}`; // cache-bust
      });
    }, imageUrl);
  }

  /**
   * Delete a transformation by name
   * @param name - Name of the transformation to delete
   */
  async deleteTransformation(name: string): Promise<void> {
    const card = this.card(name);

    // Menu button appears on hover
    await card.hover();
    await expect(S.transformationMenuButton(card)).toBeVisible({ timeout: 20_000 });
    await S.transformationMenuButton(card).click();

    await S.deleteMenuItem(this.page).click();
    await S.deleteConfirmButton(this.page).click();

    await expect(this.page.getByText(name, { exact: true })).toBeHidden({ timeout: 20_000 });
  }
}
