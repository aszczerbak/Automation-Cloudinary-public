import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC-UploadPresets-Authenticated-DeliveryType
 * Title: Create Upload Preset with "Authenticated" delivery type
 *
 * Description:
 * Creates an Upload Preset, sets the delivery type to "Authenticated" in the "Optimize and Deliver" tab,
 * verifies the saved preset reflects this setting, and then deletes the preset as cleanup.
 *
 * Steps:
 * 1) Open Cloudinary Console → Settings → Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Go to "Optimize and Deliver" tab
 * 4) Set delivery type to "Authenticated"
 * 5) Save the preset
 * 6) Verify the preset is listed and details show "type: authenticated"
 * 7) Delete the created preset (cleanup)
 */
test('Create Upload Preset with Authenticated Delivery Type', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step: Generate preset name and open page
  const presetName = `e2e_authenticated_${randomString()}`;
  await presetsPage.goToUploadPresets();

  // Step: Start creation and go to Optimize and Deliver
  await presetsPage.startPresetCreation(presetName);
  await presetsPage.openOptimizeAndDeliver();

  // Step: Select Authenticated delivery type
  await UploadPresets.deliveryTypeDropdownLegacy(page).click();
  await UploadPresets.optionExactText(page, 'Authenticated').click();

  // Step: Save preset and wait for row
  const row = await presetsPage.savePresetAndWaitForRow(presetName);

  try {
    // Step: Open details and expand
    await presetsPage.openDetailsWithShowMore(row);

    // Step: Verify delivery type is authenticated
    await expect(UploadPresets.detailsText(page, /type:\s*authenticated/i)).toBeVisible();
  } finally {
    await UploadPresets.pressEscape(page).catch(() => undefined);
    await presetsPage.deletePresetByName(presetName);
  }
});
