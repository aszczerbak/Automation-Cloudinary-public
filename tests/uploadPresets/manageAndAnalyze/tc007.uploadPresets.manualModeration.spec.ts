import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC007-UploadPresets-ManualModeration
 * Title: Upload Presets - Manual moderation
 *
 * Description:
 * Creates an Upload Preset, enables "Manual moderation" in "Manage and Analyze", saves, verifies details,
 * then deletes the preset as cleanup.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset
 * 3) Go to "Manage and Analyze"
 * 4) Enable "Manual moderation"
 * 5) Save
 * 6) Verify details show "moderation: manual"
 * 7) Delete preset (cleanup)
 */
test('Upload Presets: manual moderation', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate a unique preset name
  const presetName = `e2e_moderation_${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: switch to Manage and Analyze
  await presetsPage.openManageAndAnalyze();

  // Step 5: enable Manual moderation
  await presetsPage.ensureSwitchOn(UploadPresets.manualModerationSwitch(page));

  // Step 6: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 20_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: verify manual moderation enabled (flexible regex matching)
    await expect(UploadPresets.detailsText(page, /moderation.*manual|manual.*moderation/i)).toBeVisible({
      timeout: 10_000,
    });
  } finally {
    // Step 9: close details panel
    await UploadPresets.pressEscape(page);

    // Step 10: delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
