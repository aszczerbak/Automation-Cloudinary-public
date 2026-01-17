import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC001-UploadPresets-Context
 * Title: Upload Presets - Context key/value
 *
 * Description:
 * Creates an Upload Preset, adds a context key/value entry in "Manage and Analyze",
 * saves, verifies the context appears in the details table, and deletes the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset with unique name
 * 3) Go to "Manage and Analyze"
 * 4) Add context entry (key/value)
 * 5) Save
 * 6) Verify details table contains context entry
 * 7) Delete preset (cleanup)
 */
test('Create Upload Preset with Context', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: create unique preset name
  const presetName = `e2e_context_${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: switch to Manage and Analyze
  await presetsPage.openManageAndAnalyze();

  // Step 5: add context key/value
  await UploadPresets.contextKeyInput(page).fill('Test');
  await UploadPresets.contextValueInput(page).fill('123');
  await UploadPresets.contextAddButton(page).click();

  // Step 6: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 20_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: verify context entry
    await expect(UploadPresets.detailsTbody(page)).toContainText('context: =|Test=123');
  } finally {
    // Step 9: close details and delete preset
    await UploadPresets.pressEscape(page);
    await presetsPage.deletePresetByName(presetName);
  }
});
