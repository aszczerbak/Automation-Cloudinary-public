import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC-UploadPresets-DiscardOriginalFilename-True
 * Title: Create Upload Preset with "Discard original filename" enabled
 *
 * Description:
 * Creates an Upload Preset, enables "Discard original filename" in the "Optimize and Deliver" tab,
 * verifies details show the value is true, and deletes the preset as cleanup.
 *
 * Steps:
 * 1) Open Cloudinary Console → Settings → Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Go to "Optimize and Deliver" tab
 * 4) Enable "Discard original filename"
 * 5) Save the preset
 * 6) Verify the preset exists in the table
 * 7) Open details and verify it contains "discard original filename: true"
 * 8) Delete the preset and verify it is removed (cleanup)
 */
test('Upload Presets: discard original filename', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);
  const presetName = `e2e_discardfilename_${randomString()}`;

  // Step: Open page and start preset creation
  await presetsPage.goToUploadPresets();
  await presetsPage.startPresetCreation(presetName);

  // Step: Navigate to Optimize and Deliver
  await presetsPage.openOptimizeAndDeliver();

  // Step: Enable discard original filename
  const discardSwitch = UploadPresets.discardOriginalFileNameSwitch(page);
  if (await discardSwitch.isVisible().catch(() => false)) {
    await presetsPage.ensureSwitchOn(discardSwitch);
  } else {
    await UploadPresets.discardOriginalFileNameLabelFallback(page).click();
  }

  // Step: Save preset and wait for row
  const row = await presetsPage.savePresetAndWaitForRow(presetName);

  try {
    // Step: Open details and expand
    await presetsPage.openDetailsWithShowMore(row);

    // Step: Verify discard original filename enabled
    await expect(UploadPresets.detailsText(page, /discard original filename:\s*true/i)).toBeVisible();
  } finally {
    await UploadPresets.pressEscape(page).catch(() => undefined);
    await presetsPage.deletePresetByName(presetName);
  }
});
