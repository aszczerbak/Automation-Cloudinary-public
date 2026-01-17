/**
 * TC ID: TC003-TransformationBuilder-Resize-Fill
 * Title: Transformation Builder - Fill Resize Test
 *
 * Description:
 * Tests the Fill (c_fill) transformation mode which crops the image to fill
 * the specified dimensions while maintaining the aspect ratio.
 *
 * Steps:
 * 1) Navigate to Transformation Builder
 * 2) Apply Fill transformation with 500x500 dimensions
 * 3) Save transformation with unique name
 * 4) Open saved transformations list and locate the saved transformation
 * 5) Open transformation card and verify parameters contain c_fill,h_500,w_500
 * 6) Extract transformed image URL and verify actual dimensions are 500x500
 * 7) Delete the transformation (cleanup)
 */
import { expect, test } from '@playwright/test';
import { TransformationBuilderPage } from '../../../src/pages/TransformationBuilderPage';
import { randomString } from '../../../src/utils/utils';

test.use({
  storageState: '.auth/cloudinary.json',
  viewport: { width: 1440, height: 900 },
});

test('TB: fill 500x500 -> save as -> verify params + image size -> delete', async ({ page }) => {
  const tb = new TransformationBuilderPage(page);

  const width = 500;
  const height = 500;
  const name = `tr_${randomString()}`;

  await tb.goto();

  // 1) Apply Fill 500x500
  await tb.applyResize('Fill', width, height);

  // 2) Save As
  await tb.saveAs(name);

  // 3) Open saved list + open the saved card
  await tb.openSavedList();
  await tb.openCard(name);

  // 4) Verify params
  await tb.showParameters();
  await tb.expectParamsContains(`c_fill,h_${String(height)},w_${String(width)}/`);

  // 5) Verify resulting image dimensions
  const url = await tb.getTransformedImageUrl(width, height, name);
  const size = await tb.getImageSize(url);

  expect(size.width).toBe(width);
  expect(size.height).toBe(height);

  // 6) Cleanup
  await tb.deleteTransformation(name);
});
