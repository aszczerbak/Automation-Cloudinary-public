import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC009-UploadPresets-CustomPublicIdPrefix
 * Title: Upload Presets - Custom Public ID Prefix Path
 *
 * Description:
 * Creates an Upload Preset, enables prepend path, selects "Use a custom path" and sets a custom prefix path.
 * Verifies details show asset folder prefix=false and that the custom prefix is set. Deletes the preset after.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Enable prepend path option
 * 4) Select "Use a custom path" and set custom prefix value
 * 5) Save
 * 6) Verify details show: use asset folder prefix=false, and public id prefix=<custom>
 * 7) Delete preset (cleanup)
 */
test('Upload Presets: custom public ID prefix path', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: unique preset name and custom path
  const presetName = `e2e_custompublicidprefix_${randomString()}`;
  const customPath = 'test';

  // Step 3: start creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: enable prepend path switch
  await presetsPage.ensureSwitchOn(UploadPresets.prependPathToPublicIdSwitch(page));

  // Step 5: select "Use a custom path"
  await UploadPresets.useCustomPathRadio(page).check();

  // Step 6: fill custom prefix path
  await UploadPresets.customPublicIdPrefixPathInput(page).fill(customPath);

  // Step 7: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 15_000);

  try {
    // Step 8: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 9: verify asset folder prefix is false (custom path used instead)
    await expect(UploadPresets.detailsText(page, /use asset folder as public id prefix:\s*false/i)).toBeVisible();

    // Step 10: verify custom prefix path value
    await expect(UploadPresets.detailsText(page, new RegExp(`public id prefix:\\s*${customPath}`, 'i'))).toBeVisible();
  } finally {
    // Step 11: close details
    await UploadPresets.pressEscape(page);

    // Step 12: delete (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
