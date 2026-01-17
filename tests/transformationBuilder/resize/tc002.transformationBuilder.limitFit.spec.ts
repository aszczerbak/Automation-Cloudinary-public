/**
 * TC ID: TC002-TransformationBuilder-Resize-LimitFit
 * Title: Transformation Builder - Limit Fit Resize Test
 *
 * Description:
 * Tests the Limit Fit (c_limit) transformation mode which maintains aspect ratio
 * and ensures dimensions don't exceed the specified bounds.
 *
 * Steps:
 * 1) Navigate to Transformation Builder
 * 2) Apply Limit Fit transformation with 500x500 dimensions
 * 3) Save transformation with unique name
 * 4) Open saved transformations list and locate the saved transformation
 * 5) Open transformation card and verify parameters contain c_limit,h_500,w_500
 * 6) Extract transformed image URL and verify actual dimensions are ≤ 500x500 (aspect ratio maintained)
 * 7) Delete the transformation (cleanup)
 */
import { expect, test } from '@playwright/test';
import { TransformationBuilderPage } from '../../../src/pages/TransformationBuilderPage';
import { randomString } from '../../../src/utils/utils';

test('TB: limit fit 500x500 -> save as -> verify params + image size -> delete', async ({ page }) => {
  const tb = new TransformationBuilderPage(page);

  const width = 500;
  const height = 500;
  const name = `tr_${randomString()}`;

  await tb.goto();

  // 1) Apply Limit Fit 500x500
  await tb.applyResize('Limit Fit', width, height);

  // 2) Save As
  await tb.saveAs(name);

  // 3) Open saved list + open the saved card
  await tb.openSavedList();
  await tb.openCard(name);

  // 4) Verify params
  await tb.showParameters();
  await tb.expectParamsContains(`c_limit,h_${String(height)},w_${String(width)}/`);

  // 5) Verify resulting image dimensions - Limit Fit maintains aspect ratio
  const url = await tb.getTransformedImageUrl(width, height, name);
  const size = await tb.getImageSize(url);

  // Limit Fit maintains aspect ratio - dimensions should be <= requested
  expect(size.width).toBeLessThanOrEqual(width);
  expect(size.height).toBeLessThanOrEqual(height);

  // 6) Cleanup
  await tb.deleteTransformation(name);
});
