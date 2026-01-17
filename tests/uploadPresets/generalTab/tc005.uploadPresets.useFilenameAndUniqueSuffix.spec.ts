import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC005-UploadPresets-UseFilenameAndUniqueSuffix
 * Title: Upload Presets - Use Filename with Unique Suffix
 *
 * Description:
 * Creates an Upload Preset that uses filename as public ID and enables unique suffix.
 * Verifies details show both flags enabled, then deletes the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Enable "Use filename as public ID"
 * 4) Enable "Append a unique suffix"
 * 5) Save
 * 6) Verify details show both enabled
 * 7) Delete preset (cleanup)
 */
test('Upload Presets: use filename + append unique suffix', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: unique preset name
  const presetName = `e2e_uniquefilename_${randomString()}`;

  // Step 3: start creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: enable "Use filename as public ID"
  await UploadPresets.useFilenameAsPublicIdRadio(page).check();

  // Step 5: enable unique suffix switch
  await presetsPage.ensureSwitchOn(UploadPresets.appendUniqueSuffixSwitch(page));

  // Step 6: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 15_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: verify both settings
    await expect(UploadPresets.detailsText(page, /use filename:\s*true/i)).toBeVisible();
    await expect(UploadPresets.detailsText(page, /unique filename:\s*true/i)).toBeVisible();
  } finally {
    // Step 9: close details
    await UploadPresets.pressEscape(page);

    // Step 10: delete (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
