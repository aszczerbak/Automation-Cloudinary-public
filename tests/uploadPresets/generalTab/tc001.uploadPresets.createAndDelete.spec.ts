import { test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC001-UploadPresets-CreateAndDelete
 * Title: Upload Presets - Create and Delete
 *
 * Description:
 * Verifies the basic lifecycle of an upload preset: create → save → verify in list → delete → verify removed.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset with a unique name
 * 3) Save
 * 4) Verify preset exists in table
 * 5) Delete preset
 * 6) Verify preset is removed
 */
test('Upload Presets: create and delete preset', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate a unique preset name
  const presetName = `e2e_simple_${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: save and wait for the row
  await presetsPage.savePresetAndWaitForRow(presetName, 15_000);

  // Step 5: delete preset (cleanup)
  await presetsPage.deletePresetByName(presetName);
});
