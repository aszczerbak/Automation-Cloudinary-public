import type { Locator, Page } from '@playwright/test';

/**
 * Media Library / Assets selectors.
 * Keep selectors stable and 1:1 with working tests.
 */
export const MediaLibrary = {
  // Left navigation entry to Assets
  navAssetsLink: (page: Page): Locator => page.getByRole('link', { name: 'Assets' }),

  // Landing/section text click (your known working flow)
  assetsLandingText: (page: Page): Locator => page.getByText('AssetsDigital Asset Management'),

  // Main upload button that opens the Upload Widget
  uploadButton: (page: Page): Locator => page.locator('[data-test="upload-btn"]'),

  // “Back to Assets grid” link inside Media Library container
  mediaLibraryAssetsLink: (page: Page): Locator =>
    page.locator('[data-test="mediaLibraryAssets"]').getByRole('link', { name: 'Assets' }),

  // Asset cards grid
  assetCard: (page: Page): Locator => page.locator('[data-test="asset-card"]'),

  // Permission label shown in asset view (Restricted test)
  assetPermissionText: (page: Page): Locator => page.locator('[data-test="asset-permission-text"]'),

  // Summary list content used in Authenticated/Private tests
  summaryList: (page: Page): Locator => page.getByTestId('tab-content-summary').getByRole('list'),

  /**
   * Clickable permission label in UI (Authenticated / Private tests)
   *
   * WARNING: This selector is fragile as it relies on UI text.
   * Consider using data-test attributes if available.
   */
  permissionLabel: (page: Page, label: string): Locator => page.getByText(label),

  // Metadata tab selector (tag verification test)
  metadataTab: (page: Page): Locator => page.locator('[data-test="metadata"]').getByText('Metadata'),

  // Tag chips (tag verification test)
  chipValue: (page: Page): Locator => page.getByTestId('chip-value'),

  // Delete selection (asset cleanup)
  selectionDelete: (page: Page): Locator => page.locator('[data-test="selection-delete"]'),

  // Confirm delete button in dialog (asset cleanup)
  confirmDelete: (page: Page): Locator => page.getByTestId('confirm-dialog-confirm-button'),
} as const;
