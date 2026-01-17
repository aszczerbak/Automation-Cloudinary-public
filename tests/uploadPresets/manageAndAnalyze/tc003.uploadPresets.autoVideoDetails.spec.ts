import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC003-UploadPresets-AutoVideoDetails
 * Title: Upload Presets - Auto video details
 *
 * Description:
 * Creates an Upload Preset, enables "Auto video details" in "Manage and Analyze",
 * saves, verifies details contain "auto video details: {}" and deletes the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create a new preset
 * 3) Go to "Manage and Analyze"
 * 4) Enable "Auto video details"
 * 5) Save
 * 6) Verify details show "auto video details: {}"
 * 7) Delete preset (cleanup)
 */
test('Upload Presets: auto video details', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate a unique preset name
  const presetName = `e2e_videodetails_${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: switch to Manage and Analyze
  await presetsPage.openManageAndAnalyze();

  // Step 5: enable Auto video details
  await presetsPage.ensureSwitchOn(UploadPresets.autoVideoDetailsSwitch(page));

  // Step 6: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 20_000);

  try {
    // Step 7: open the preset details panel (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: verify "auto video details" field is present in details
    await expect(UploadPresets.detailsText(page, /auto video details:\s*\{\s*\}/i)).toBeVisible();
  } finally {
    // Step 9: close details panel
    await UploadPresets.pressEscape(page);

    // Step 10: delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
