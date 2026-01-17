import { expect, type FrameLocator, type Page } from '@playwright/test';
import { MediaLibrary } from '../selectors/mediaLibrary.selectors';
import { UploadWidget } from '../selectors/uploadWidget.selectors';

/**
 * Page Object for Cloudinary Media Library interactions.
 * Handles asset management, uploads via Upload Widget, and asset verification.
 */
export class MediaLibraryPage {
  constructor(public readonly page: Page) {}

  /**
   * Opens the Upload Widget iframe and returns a FrameLocator for interaction.
   * Navigates: Nav Assets → Landing → Upload button → Wait for iframe
   * @returns FrameLocator for Upload Widget iframe
   */
  async openUploadWidget(): Promise<FrameLocator> {
    // Open Assets from nav
    await MediaLibrary.navAssetsLink(this.page).click();

    // Click landing entry (known working flow)
    await MediaLibrary.assetsLandingText(this.page).click();

    // Click Upload button
    await MediaLibrary.uploadButton(this.page).click();

    // Wait for Upload Widget iframe
    const iframe = UploadWidget.iframe(this.page);
    await expect(iframe).toBeVisible();

    // Get frame locator for iframe interactions
    const frame = this.page.frameLocator('[data-test="uw-iframe"]');

    // Wait for Choose File button
    await expect(UploadWidget.chooseFileButton(frame)).toBeVisible();

    return frame;
  }

  /**
   * Uploads a file using the Upload Widget iframe.
   * Waits for upload completion and closes the widget.
   * @param frameLocator - FrameLocator from openUploadWidget()
   * @param filePath - Absolute path to the file to upload
   */
  async uploadFile(frameLocator: FrameLocator, filePath: string): Promise<void> {
    // Choose file
    await UploadWidget.chooseFileButton(frameLocator).setInputFiles(filePath);

    // Wait for "done-ish" state OR progress disappearing
    await Promise.race([
      UploadWidget.doneText(frameLocator)
        .waitFor({ state: 'visible' })
        .catch(() => {
          // Ignore - fallback to progress check
        }),
      UploadWidget.progress(frameLocator)
        .first()
        .waitFor({ state: 'hidden' })
        .catch(() => {
          // Ignore - best effort
        }),
    ]);

    // Close widget if possible, else Escape
    const closeBtn = UploadWidget.closeButton(frameLocator);
    const isCloseVisible = await closeBtn.isVisible().catch(() => false);
    if (isCloseVisible) {
      await closeBtn.click();
    } else {
      await this.page.keyboard.press('Escape');
    }

    // Ensure iframe disappears (best-effort)
    await UploadWidget.iframe(this.page)
      .waitFor({ state: 'hidden' })
      .catch(() => {
        // Ignore - best effort
      });
  }

  /**
   * Navigates to Assets grid and opens the newest (first) asset card.
   */
  async openNewestAsset(): Promise<void> {
    // Back to Assets grid
    await MediaLibrary.mediaLibraryAssetsLink(this.page).click();

    // Open newest (first) asset card
    const firstCard = MediaLibrary.assetCard(this.page).first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();
  }

  /**
   * Verifies the asset's delivery type matches the expected value.
   * Uses flexible text matching for Authenticated, Private, or Restricted.
   * @param deliveryType - Expected delivery type: 'Authenticated', 'Private', or 'Restricted'
   */
  async assertDeliveryType(deliveryType: 'Authenticated' | 'Private' | 'Restricted'): Promise<void> {
    const regex = new RegExp(deliveryType, 'i');

    if (deliveryType === 'Restricted') {
      // Restricted uses specific permission text locator
      await expect(MediaLibrary.assetPermissionText(this.page)).toContainText('Restricted');
    } else {
      // Authenticated and Private use generic text search
      await expect(this.page.getByText(regex).first()).toBeVisible({ timeout: 10_000 });
    }
  }

  /**
   * Deletes the currently selected asset (must be open in detail view).
   * Clicks delete button and confirms the deletion.
   */
  async deleteSelectedAsset(): Promise<void> {
    // Delete selected asset
    await MediaLibrary.selectionDelete(this.page).click();

    // Confirm delete
    await MediaLibrary.confirmDelete(this.page).click();
  }

  /**
   * Navigates to Assets page via nav link.
   */
  async goToAssets(): Promise<void> {
    await MediaLibrary.navAssetsLink(this.page).click();
  }
}
