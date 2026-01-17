import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC003-UploadPresets-OverwriteDisabled
 * Title: Upload Presets - Overwrite Disabled
 *
 * Description:
 * Creates an Upload Preset with overwrite disabled and verifies details show "overwrite: false", then deletes it.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Disable overwrite
 * 4) Save
 * 5) Verify details show overwrite=false
 * 6) Delete preset (cleanup)
 */
test('Upload Presets: overwrite disabled', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate unique preset name
  const presetName = `e2e_overwrite_${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: disable overwrite switch
  await presetsPage.ensureSwitchOff(UploadPresets.overwriteSwitch(page));

  // Step 5: save preset
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 15_000);

  try {
    // Step 6: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 7: verify overwrite is false
    await expect(UploadPresets.detailsText(page, /overwrite:\s*false/i)).toBeVisible();
  } finally {
    // Step 8: close details panel
    await UploadPresets.pressEscape(page);

    // Step 9: delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
