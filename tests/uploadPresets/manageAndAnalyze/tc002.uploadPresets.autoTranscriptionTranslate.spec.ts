import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC002-UploadPresets-AutoTranscription-Translate
 * Title: Upload Presets - Auto transcription (translate)
 *
 * Description:
 * Creates an Upload Preset, enables Auto transcription + Translate in "Manage and Analyze",
 * selects a language (Afrikaans), saves, verifies details include "af" in the serialized JSON, then deletes.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Go to "Manage and Analyze"
 * 4) Enable Auto transcription and Translate
 * 5) Select language = Afrikaans
 * 6) Save
 * 7) Verify details show auto transcription JSON containing "af"
 * 8) Delete preset (cleanup)
 */
test('Upload Presets: auto transcription (translate)', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate a unique preset name
  const presetName = `e2e_transcription_${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: switch to Manage and Analyze
  await presetsPage.openManageAndAnalyze();

  // Step 5: enable Auto transcription and Translate
  await presetsPage.ensureSwitchOn(UploadPresets.autoTranscriptionSwitch(page));
  await presetsPage.ensureSwitchOn(UploadPresets.translateSwitch(page));

  // Step 6: select language = Afrikaans
  await UploadPresets.autoTranscriptionSelectNth1(page).click();
  const langInput = UploadPresets.autoTranscriptionLanguagesInput(page);
  await langInput.fill('Afrikaans');
  await langInput.press('Enter');

  // Step 7: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 20_000);

  try {
    // Step 8: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 9: verify the auto transcription JSON contains the Afrikaans language code ("af")
    await expect(UploadPresets.detailsText(page, /auto transcription:\s*\{.*"af".*\}/i)).toBeVisible();
  } finally {
    // Step 10: close details panel
    await UploadPresets.pressEscape(page);

    // Step 11: delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
