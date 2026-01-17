import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC005-UploadPresets-AutoChaptering
 * Title: Upload Presets - Auto chaptering
 *
 * Description:
 * Creates an Upload Preset, enables "Auto chaptering" in "Manage and Analyze",
 * saves, verifies details show "auto chaptering: true", then deletes the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Go to "Manage and Analyze"
 * 4) Enable auto chaptering
 * 5) Save
 * 6) Verify details show "auto chaptering: true"
 * 7) Delete preset (cleanup)
 */
test('Upload Presets: auto chaptering', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate a unique preset name
  const presetName = `e2e_chaptering_${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: switch to Manage and Analyze
  await presetsPage.openManageAndAnalyze();

  // Step 5: enable "Auto chaptering"
  await presetsPage.ensureSwitchOn(UploadPresets.autoChapteringSwitch(page));

  // Step 6: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 20_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: verify auto chaptering enabled
    await expect(UploadPresets.detailsText(page, /auto chaptering:\s*true/i)).toBeVisible();
  } finally {
    // Step 9: close details panel
    await UploadPresets.pressEscape(page);

    // Step 10: delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
