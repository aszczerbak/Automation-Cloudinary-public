import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC-UploadPresets-Format-JPG
 * Title: Create Upload Preset with format = jpg
 *
 * Description:
 * Creates a new Upload Preset, sets the "format" field to "jpg" in the "Optimize and Deliver" tab,
 * verifies the preset details reflect the saved format, and then deletes the preset as cleanup.
 *
 * Steps:
 * 1) Open Cloudinary Console → Settings → Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Go to "Optimize and Deliver" tab
 * 4) Set "format" to "jpg"
 * 5) Save the preset
 * 6) Verify the preset exists in the table
 * 7) Open details and verify it contains "format: jpg"
 * 8) Delete the preset and verify it is removed (cleanup)
 */
test('Upload Presets: format', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);
  const presetName = `e2e_format_${randomString()}`;

  // Step: Open page and start preset creation
  await presetsPage.goToUploadPresets();
  await presetsPage.startPresetCreation(presetName);

  // Step: Navigate to Optimize and Deliver
  await presetsPage.openOptimizeAndDeliver();

  // Step: Set format to jpg
  await UploadPresets.formatInput(page).fill('jpg');

  // Step: Save preset and wait for row
  const row = await presetsPage.savePresetAndWaitForRow(presetName);

  try {
    // Step: Open details and expand
    await presetsPage.openDetailsWithShowMore(row);

    // Step: Verify format is jpg
    await expect(UploadPresets.detailsText(page, /format:\s*jpg/i)).toBeVisible();
  } finally {
    await UploadPresets.pressEscape(page).catch(() => undefined);
    await presetsPage.deletePresetByName(presetName);
  }
});
