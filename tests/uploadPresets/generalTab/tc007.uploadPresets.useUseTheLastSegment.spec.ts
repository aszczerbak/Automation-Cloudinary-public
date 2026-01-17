import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC007-UploadPresets-PublicIdAsDisplayName-LastSegment
 * Title: Upload Presets - Public ID as display name (last segment)
 *
 * Description:
 * Creates an Upload Preset, enables "Use filename as public ID", toggles the "publicIdAsDisplayName" option
 * (label[for="publicIdAsDisplayName"]), verifies details show "use filename as display name: false",
 * then deletes the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Enable "Use filename as public ID"
 * 4) Click "publicIdAsDisplayName" label
 * 5) Save
 * 6) Verify details show use filename as display name=false
 * 7) Delete preset (cleanup)
 */
test('Upload Presets: public ID as display name (last segment)', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: unique preset name
  const presetName = `e2e_displayname_publicid_${randomString()}`;

  // Step 3: start creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: enable "Use filename ..." radio (required in most flows where display-name options appear)
  await UploadPresets.useFilenameAsPublicIdRadio(page).check();

  // Step 5: click label[for="publicIdAsDisplayName"]
  await UploadPresets.publicIdAsDisplayNameLabel(page).click();

  // Step 6: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 15_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: verify display name behavior
    await expect(UploadPresets.detailsText(page, /use filename as display name:\s*false/i)).toBeVisible();
  } finally {
    // Step 9: close details
    await UploadPresets.pressEscape(page);

    // Step 10: delete (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
