import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC-UploadPresets-Private-DeliveryType
 * Title: Create Upload Preset with "Private" delivery type
 *
 * Description:
 * Creates an Upload Preset, sets the delivery type to "Private" in the "Optimize and Deliver" tab,
 * verifies the saved preset reflects this setting, and then deletes the preset as cleanup.
 *
 * Steps:
 * 1) Open Cloudinary Console → Settings → Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Go to "Optimize and Deliver" tab
 * 4) Set delivery type to "Private"
 * 5) Save the preset
 * 6) Verify the preset is listed and details show "type: private"
 * 7) Delete the created preset (cleanup)
 */
test('Create Upload Preset with Private Delivery Type', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step: Generate preset name and open page
  const presetName = `e2e_private_${randomString()}`;
  await presetsPage.goToUploadPresets();

  // Step: Start creation and go to Optimize and Deliver
  await presetsPage.startPresetCreation(presetName);
  await presetsPage.openOptimizeAndDeliver();

  // Step: Select Private delivery type
  await UploadPresets.deliveryTypeDropdownLegacy(page).click();
  await UploadPresets.optionExactText(page, 'Private').click();

  // Step: Save preset and wait for row
  const row = await presetsPage.savePresetAndWaitForRow(presetName);

  try {
    // Step: Open details and expand
    await presetsPage.openDetailsWithShowMore(row);

    // Step: Verify delivery type is private
    await expect(UploadPresets.detailsText(page, /type:\s*private/i)).toBeVisible();
  } finally {
    await UploadPresets.pressEscape(page).catch(() => undefined);
    await presetsPage.deletePresetByName(presetName);
  }
});
