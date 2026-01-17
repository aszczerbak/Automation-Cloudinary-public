import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC006-UploadPresets-Tags
 * Title: Upload Presets - Tags
 *
 * Description:
 * Creates an Upload Preset, adds a tag in "Manage and Analyze", saves, and verifies the tag appears in details.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset with a unique name
 * 3) Go to "Manage and Analyze"
 * 4) Add a tag
 * 5) Save
 * 6) Verify details show tags and contain the tag value
 *
 * Notes:
 * Cleanup (delete) is intentionally commented out to match the original test.
 */
test('Upload Presets: tags', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: generate unique names
  const presetName = `e2e_tag_${randomString()}`;
  const tagName = `e2e-tag-${randomString()}`;

  // Step 3: start preset creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: open Manage and Analyze tab
  await presetsPage.openManageAndAnalyze();

  // Step 5: add tag (legacy selector flow kept as-is)
  await UploadPresets.tagsDropdownLegacy(page).click();
  await UploadPresets.tagsComboboxInput(page).fill(tagName);
  await UploadPresets.tagsFirstOptionPrimaryContent(page).click();

  // Step 6: save
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 20_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    // Step 8: verify tags section + tag value
    await expect(UploadPresets.detailsText(page, /tags:/i)).toBeVisible();
    await expect(UploadPresets.detailsText(page, tagName)).toBeVisible();
  } finally {
    // Step 9: close details panel
    await UploadPresets.pressEscape(page);

    // Step 10: delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
