import type { FrameLocator, Locator, Page } from '@playwright/test';

/**
 * Upload Widget selectors (iframe-based).
 *
 * This module provides selectors for interacting with elements inside the Upload Widget iframe.
 * All selectors that interact with iframe content require a FrameLocator parameter.
 *
 * @example
 * import { UploadWidget } from '@/selectors/uploadWidget.selectors';
 * const frame = page.frameLocator('[data-test="uw-iframe"]');
 * await UploadWidget.chooseFileButton(frame).click();
 */
export const UploadWidget = {
  // Iframe mounting the Upload Widget
  iframe: (page: Page): Locator => page.locator('[data-test="uw-iframe"]'),

  /**
   * "Choose File" button inside the upload widget
   * @param frame - Playwright FrameLocator for the upload widget iframe
   */
  chooseFileButton: (frame: FrameLocator): Locator => frame.getByRole('button', { name: 'Choose File' }),

  /**
   * Close button in the widget (appears after upload completes)
   * @param frame - Playwright FrameLocator for the upload widget iframe
   */
  closeButton: (frame: FrameLocator): Locator => frame.locator('[data-test="close-btn"]'),

  /**
   * "Done" text indicator showing upload completion
   *
   * WARNING: Uses text-based matching which may be unstable across UI updates.
   * @param frame - Playwright FrameLocator for the upload widget iframe
   */
  doneText: (frame: FrameLocator): Locator =>
    frame.getByText(/uploaded successfully|upload complete|done|complete|uploaded/i),

  /**
   * Upload progress indicator(s) - spinner or progress bar
   * @param frame - Playwright FrameLocator for the upload widget iframe
   */
  progress: (frame: FrameLocator): Locator => frame.locator('[data-test*="progress"], [role="progressbar"]'),
} as const;
