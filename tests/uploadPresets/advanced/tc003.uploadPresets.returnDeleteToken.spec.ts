import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC003-UploadPresets-Return-Delete-Token
 * Title: Enable return delete token and verify persistence
 *
 * Description:
 * Creates an upload preset, enables "Return delete token" in the Advanced tab, saves, confirms the flag
 * is persisted in details, and deletes the preset as cleanup.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Go to "Advanced" tab
 * 4) Enable "Return delete token"
 * 5) Save the preset and wait for the row
 * 6) Open details (Show more if needed)
 * 7) Verify return_delete_token is true
 * 8) Delete the preset (cleanup)
 */
test('Upload Presets: return delete token enabled', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate a unique preset name
  const presetName = `e2e_rdt_${randomString()}`;

  // Step 3: start preset creation and fill the name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: switch to Advanced tab
  await presetsPage.openAdvancedTab();

  // Step 5: enable "Return delete token" if not already on
  await presetsPage.ensureSwitchOn(UploadPresets.returnDeleteTokenSwitch(page));

  // Step 6: save and wait for the row to appear
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 20_000);

  try {
    // Step 7: open details for the new preset (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: assert return_delete_token is persisted
    await expect(UploadPresets.detailsText(page, /return[_\s]*delete[_\s]*token:\s*true/i)).toBeVisible();
  } finally {
    // Step 9: close details and delete the preset
    await UploadPresets.pressEscape(page);

    await presetsPage.deletePresetByName(presetName);
  }
});
