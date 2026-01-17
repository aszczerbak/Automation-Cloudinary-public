import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC-UploadPresets-Invalidate-Enabled
 * Title: Create Upload Preset with invalidate enabled
 *
 * Description:
 * Creates an Upload Preset, enables the "invalidate" switch in the "Advanced" tab,
 * verifies details show "invalidate: true", and deletes the preset as cleanup.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Go to "Advanced" tab
 * 4) Enable "invalidate"
 * 5) Save the preset
 * 6) Verify details contain "invalidate: true"
 * 7) Delete the preset (cleanup)
 */
test('Upload Presets: invalidate enabled', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate unique preset name
  const presetName = `e2e_invalidate_${randomString()}`;

  // Step 3: start creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: open Advanced tab
  await presetsPage.openAdvancedTab();

  // Step 5: enable invalidate switch
  await presetsPage.ensureSwitchOn(UploadPresets.invalidateSwitch(page));

  // Step 6: save and wait for the row
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 20_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: assert invalidate is persisted
    await expect(UploadPresets.detailsText(page, /invalidate:\s*true/i)).toBeVisible();
  } finally {
    // Step 9: close details and delete preset
    await UploadPresets.pressEscape(page);

    await presetsPage.deletePresetByName(presetName);
  }
});
