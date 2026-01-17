import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC011-UploadPresets-PredominantColors
 * Title: Upload Presets - Predominant colors
 *
 * Description:
 * Creates an Upload Preset, enables "Retrieve predominant colors" in "Manage and Analyze",
 * saves, verifies details show "colors: true", then deletes the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Go to "Manage and Analyze"
 * 4) Enable predominant colors
 * 5) Save
 * 6) Verify details show "colors: true"
 * 7) Delete preset (cleanup)
 */
test('Upload Presets: predominant colors', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate a unique preset name
  const presetName = `e2e_colors_${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: switch to Manage and Analyze
  await presetsPage.openManageAndAnalyze();

  // Step 5: enable "Retrieve predominant colors"
  await presetsPage.ensureSwitchOn(UploadPresets.predominantColorsSwitch(page));

  // Step 6: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 20_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: verify predominant colors enabled
    await expect(UploadPresets.detailsText(page, /colors:\s*true/i)).toBeVisible();
  } finally {
    // Step 9: close details panel
    await UploadPresets.pressEscape(page);

    // Step 10: delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
