import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC004-UploadPresets-SigningMode-Unsigned
 * Title: Upload Presets - Signing Mode Unsigned
 *
 * Description:
 * Creates an Upload Preset, sets signing mode to "Unsigned", verifies in details, then deletes the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Set signing mode = Unsigned
 * 4) Save
 * 5) Verify details show unsigned
 * 6) Delete preset (cleanup)
 */
test('Upload Presets: signing mode = Unsigned', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: unique preset name
  const presetName = `e2e_unsigned_${randomString()}`;

  // Step 3: start creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: set signing mode (existing selector pattern)
  await UploadPresets.signingModeSingleValue(page).click();
  const input = UploadPresets.comboboxInputVisible(page);
  await expect(input).toBeVisible();
  await input.fill('Unsigned');
  await input.press('Enter');

  // Step 5: save preset
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 15_000);

  try {
    // Step 6: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 7: verify signing mode appears as unsigned
    await expect(UploadPresets.detailsText(page, /unsigned/i)).toBeVisible();
  } finally {
    // Step 8: close details
    await UploadPresets.pressEscape(page);

    // Step 9: delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
