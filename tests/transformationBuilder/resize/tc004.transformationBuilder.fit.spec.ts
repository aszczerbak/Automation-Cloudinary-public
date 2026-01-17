/**
 * TC ID: TC004-TransformationBuilder-Resize-Fit
 * Title: Transformation Builder - Fit Resize Test
 *
 * Description:
 * Tests the Fit (c_fit) transformation mode which resizes the image to fit within
 * the specified dimensions while maintaining the aspect ratio.
 *
 * Steps:
 * 1) Navigate to Transformation Builder
 * 2) Apply Fit transformation with 500x500 dimensions
 * 3) Save transformation with unique name
 * 4) Open saved transformations list and locate the saved transformation
 * 5) Open transformation card and verify parameters contain c_fit,h_500,w_500
 * 6) Extract transformed image URL and verify actual dimensions are ≤ 500x500 (aspect ratio maintained)
 * 7) Delete the transformation (cleanup)
 */
import { expect, test } from '@playwright/test';
import { TransformationBuilderPage } from '../../../src/pages/TransformationBuilderPage';
import { randomString } from '../../../src/utils/utils';

test.use({
  storageState: '.auth/cloudinary.json',
  viewport: { width: 1440, height: 900 },
});

test('TB: fit 500x500 -> save as -> verify params + image size -> delete', async ({ page }) => {
  const tb = new TransformationBuilderPage(page);

  const width = 500;
  const height = 500;
  const name = `tr_${randomString()}`;

  await tb.goto();

  // 1) Apply Fit 500x500
  await tb.applyResize('Fit', width, height);

  // 2) Save As
  await tb.saveAs(name);

  // 3) Open saved list + open the saved card
  await tb.openSavedList();
  await tb.openCard(name);

  // 4) Verify params
  await tb.showParameters();
  await tb.expectParamsContains(`c_fit,h_${String(height)},w_${String(width)}/`);

  // 5) Verify resulting image dimensions - Fit maintains aspect ratio
  const url = await tb.getTransformedImageUrl(width, height, name);
  const size = await tb.getImageSize(url);

  // c_fit maintains aspect ratio - dimensions should be <= requested
  expect(size.width).toBeLessThanOrEqual(width);
  expect(size.height).toBeLessThanOrEqual(height);
  // At least one dimension should reach the limit
  expect(size.width === width || size.height === height).toBe(true);

  // 6) Cleanup
  await tb.deleteTransformation(name);
});
