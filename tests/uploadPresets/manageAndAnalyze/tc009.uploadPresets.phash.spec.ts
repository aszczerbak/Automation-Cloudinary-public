import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC009-UploadPresets-Phash
 * Title: Upload Presets - Compute perceptual hash (phash)
 *
 * Description:
 * Creates an Upload Preset, enables "Compute perceptual hash" in "Manage and Analyze",
 * saves, verifies details show "phash: true", then deletes the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Go to "Manage and Analyze"
 * 4) Enable phash
 * 5) Save
 * 6) Verify details show "phash: true"
 * 7) Delete preset (cleanup)
 */
test('Upload Presets: compute perceptual hash (phash)', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate a unique preset name
  const presetName = `e2e_phash_${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: switch to Manage and Analyze
  await presetsPage.openManageAndAnalyze();

  // Step 5: enable "Compute perceptual hash"
  await presetsPage.ensureSwitchOn(UploadPresets.computePerceptualHashSwitch(page));

  // Step 6: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 20_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: verify phash enabled
    await expect(UploadPresets.detailsText(page, /phash:\s*true/i)).toBeVisible();
  } finally {
    // Step 9: close details panel
    await UploadPresets.pressEscape(page);

    // Step 10: delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
