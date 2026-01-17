import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC002-UploadPresets-AssetFolder
 * Title: Upload Presets - Set Asset Folder
 *
 * Description:
 * Creates an Upload Preset, sets an asset folder value, verifies it in the details panel, then deletes the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset with unique name
 * 3) Set asset folder
 * 4) Save
 * 5) Verify preset exists
 * 6) Open details and verify asset folder value is present
 * 7) Delete preset (cleanup)
 */
test('Upload Presets: set asset folder', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate unique names (preset + folder)
  const presetName = `e2e_assetfolder_${randomString()}`;
  const assetFolder = `e2e_folder_${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: expand Show more if present
  await presetsPage.expandShowMoreIfVisible();

  // Step 5: set asset folder
  await UploadPresets.assetFolderInput(page).fill(assetFolder);

  // Step 6: save preset
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 15_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: verify asset folder text is visible in details
    await expect(UploadPresets.detailsText(page, assetFolder)).toBeVisible();
  } finally {
    // Step 9: close details panel
    await UploadPresets.pressEscape(page);

    // Step 10: delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
