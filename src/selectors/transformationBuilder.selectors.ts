/**
 * TransformationBuilder Selectors - UI Element Locators
 *
 * Centralized repository of all Playwright locators for the Cloudinary Transformation Builder.
 * This module provides type-safe selector functions that encapsulate the UI structure,
 * making tests more maintainable and resistant to UI changes.
 *
 * @example
 * import { TransformationBuilder as S } from './selectors/transformationBuilder.selectors';
 * await S.scaleMenuItem(page).click();
 * await S.widthInput(page).fill('500');
 */
import type { Locator, Page } from '@playwright/test';

export const TransformationBuilder = {
  // =========================
  // URLs
  // =========================
  url: 'https://console.cloudinary.com/app/image/transformation_builder',

  // =========================
  // Core UI Elements
  // =========================
  /**
   * Page root container
   *
   * WARNING: Very broad selector. Use only as last resort.
   * Prefer more specific selectors like transformationDetailsPanel().
   */
  root: (page: Page): Locator => page.locator('#root'),

  // =========================
  // Resize Action Menu Items
  // =========================
  /** Generic resize menu item - accepts any action name */
  resizeMenuItem: (page: Page, actionName: string): Locator =>
    page.getByRole('menuitem', { name: actionName, exact: true }),

  // =========================
  // Form Input Controls
  // =========================
  widthInput: (page: Page): Locator => page.getByRole('spinbutton', { name: 'Width' }),
  heightInput: (page: Page): Locator => page.getByRole('spinbutton', { name: 'Height' }),

  // =========================
  // Action Buttons
  // =========================
  applyButton: (page: Page): Locator => page.getByRole('button', { name: 'Apply', exact: true }),
  saveAsButton: (page: Page): Locator => page.getByRole('button', { name: 'Save As', exact: true }),
  showParametersButton: (page: Page): Locator => page.getByRole('button', { name: 'Show Parameters' }),

  // =========================
  // Save Transformation Modal
  // =========================
  saveModal: (page: Page): Locator => page.locator('[data-test="save-transformation-modal"]'),
  saveNameInput: (page: Page): Locator =>
    page.locator('[data-test="save-transformation-modal"] [data-test="text-field"]'),
  saveButton: (page: Page): Locator => page.locator('[data-test="save-button"]'),

  // =========================
  // Notifications
  // =========================
  banner: (page: Page): Locator => page.locator('[data-test="banner"]'),
  successBanner: (page: Page): Locator => page.locator('[data-test="banner"]'),

  // =========================
  // Navigation
  // =========================
  closeBuilderButton: (page: Page): Locator => page.locator('[data-test-specifier="button-close"]'),

  // =========================
  // Saved Transformations List
  // =========================
  transformationCard: (page: Page, name: string): Locator =>
    page.locator('[data-test="transformation-card"]', { hasText: name }).first(),

  // =========================
  // Transformation Details Panel
  // =========================
  /** Panel where transformation parameters and code snippets are displayed */
  transformationDetailsPanel: (page: Page): Locator => page.locator('[data-test="transformation-details-panel"]'),
  transformationNameText: (page: Page, name: string): Locator => page.getByText(name, { exact: true }),

  // =========================
  // Card Actions
  // =========================
  transformationMenuButton: (card: Locator): Locator =>
    card.locator('[data-test="transformation-menu-button"]').first(),

  // =========================
  // Delete Actions
  // =========================
  deleteMenuItem: (page: Page): Locator => page.getByText('Delete', { exact: true }),
  deleteConfirmButton: (page: Page): Locator => page.getByRole('button', { name: 'Delete', exact: true }),

  // =========================
  // URL Extraction - Cloudinary Image URLs
  // =========================
  /**
   * Wait condition - first Cloudinary link to appear
   *
   * NOTE: This selector matches ANY Cloudinary link on the page.
   * For more specific matching, use transformedImageUrl() instead.
   */
  cloudinaryUrlLink: (page: Page): Locator => page.locator('a[href*="res.cloudinary.com"]').first(),

  /**
   * Transformed image URL with specific parameters
   *
   * Matches either:
   * 1. Direct transformation: /w_{width},h_{height}/
   * 2. Named transformation: /t_{name}/
   *
   * @param page - Playwright Page object
   * @param width - Expected width parameter
   * @param height - Expected height parameter
   * @param name - Transformation name
   */
  transformedImageUrl: (page: Page, width: number, height: number, name: string): Locator =>
    page
      .locator(`a[href*="res.cloudinary.com"][href*="w_${String(width)}"][href*="h_${String(height)}"]`)
      .first()
      .or(page.locator(`a[href*="res.cloudinary.com"][href*="t_${name}"]`).first()),
};
