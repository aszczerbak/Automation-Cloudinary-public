import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC-UploadPresets-Transformations
 * Title: Create Upload Preset with transformations (popular + eager)
 *
 * Description:
 * Creates an Upload Preset, sets popular and eager transformations in the "Transform" tab,
 * verifies they appear in the details table, and deletes the preset as cleanup.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Go to "Transform" tab
 * 4) Set transformation and eager transformation
 * 5) Save the preset
 * 6) Verify the preset exists in the table
 * 7) Open details and verify transformations are present in details table
 * 8) Delete the preset (cleanup)
 */
test('Upload Presets: transformations', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);
  const presetName = `e2e_transform_${randomString()}`;

  // Step: Open Upload Presets page and start creation
  await presetsPage.goToUploadPresets();
  await presetsPage.startPresetCreation(presetName);

  // Step: Open Transform tab
  await presetsPage.openTransformTab();

  // Step: Set transformations
  await UploadPresets.transformationInput(page).fill('f_auto/q_auto');
  await UploadPresets.eagerTransformation0Input(page).fill('f_auto/q_auto');

  // Step: Save preset and wait for row
  const row = await presetsPage.savePresetAndWaitForRow(presetName);

  try {
    // Step: Open details and expand
    await presetsPage.openDetailsWithShowMore(row);

    // Step: Verify details table contains transformation values
    await expect(UploadPresets.detailsTbody(page)).toContainText(/transformation:\s*f_auto\/q_auto/i);
    await expect(UploadPresets.detailsTbody(page)).toContainText(/eager:\s*f_auto\/q_auto/i);
  } finally {
    await UploadPresets.pressEscape(page).catch(() => undefined);
    await presetsPage.deletePresetByName(presetName);
  }
});
