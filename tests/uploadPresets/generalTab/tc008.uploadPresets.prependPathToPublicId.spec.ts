import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC008-UploadPresets-PrependPathToPublicId
 * Title: Upload Presets - Prepend Path to Public ID
 *
 * Description:
 * Creates an Upload Preset, enables "prepend path to public ID", verifies details show it enabled,
 * then deletes the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Enable prepend path to public ID
 * 4) Save
 * 5) Verify details show use asset folder as public id prefix=true
 * 6) Delete preset (cleanup)
 */
test('Upload Presets: prepend path to public ID', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: unique preset name
  const presetName = `e2e_publicidprefix_${randomString()}`;

  // Step 3: start creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: enable prepend path switch
  await presetsPage.ensureSwitchOn(UploadPresets.prependPathToPublicIdSwitch(page));

  // Step 5: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 15_000);

  try {
    // Step 6: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 7: verify
    await expect(UploadPresets.detailsText(page, /use asset folder as public id prefix:\s*true/i)).toBeVisible();
  } finally {
    // Step 8: close details
    await UploadPresets.pressEscape(page);

    // Step 9: delete (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
