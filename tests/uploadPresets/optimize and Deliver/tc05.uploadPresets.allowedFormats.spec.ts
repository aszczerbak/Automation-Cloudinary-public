import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC-UploadPresets-AllowedFormats-BMP
 * Title: Create Upload Preset with allowed formats = bmp
 *
 * Description:
 * Creates a new Upload Preset, adds "bmp" to the "allowed formats" field in the "Optimize and Deliver" tab,
 * verifies the preset details reflect the saved allowed formats value, and then deletes the preset as cleanup.
 *
 * Steps:
 * 1) Open Cloudinary Console → Settings → Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Go to "Optimize and Deliver" tab
 * 4) Add "bmp" to "allowed formats"
 * 5) Save the preset
 * 6) Verify the preset exists in the table
 * 7) Open details and verify it contains "allowed formats: bmp"
 * 8) Delete the preset and verify it is removed (cleanup)
 */
test('Upload Presets: allowed formats', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);
  const format = 'bmp';
  const presetName = `e2e_allowedformats_${randomString()}`;

  // Step: Open page and start preset creation
  await presetsPage.goToUploadPresets();
  await presetsPage.startPresetCreation(presetName);

  // Step: Navigate to Optimize and Deliver
  await presetsPage.openOptimizeAndDeliver();

  // Step: Add allowed format token
  await UploadPresets.allowedFormatsInput(page).fill(format);
  await UploadPresets.allowedFormatsInput(page).press('Enter');

  // Step: Save preset and wait for row
  const row = await presetsPage.savePresetAndWaitForRow(presetName);

  try {
    // Step: Open details and expand
    await presetsPage.openDetailsWithShowMore(row);

    // Step: Verify allowed formats include bmp
    await expect(UploadPresets.detailsText(page, 'allowed formats: bmp')).toBeVisible();
  } finally {
    await UploadPresets.pressEscape(page).catch(() => undefined);
    await presetsPage.deletePresetByName(presetName);
  }
});
