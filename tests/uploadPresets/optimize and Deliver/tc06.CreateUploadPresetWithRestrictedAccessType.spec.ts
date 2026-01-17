import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC-UploadPresets-Restricted-AccessControl
 * Title: Create Upload Preset with "Restricted" access control (date window)
 *
 * Description:
 * Creates an Upload Preset, sets Access control = Restricted, enters Start/End dates,
 * verifies details show the expected restricted access window, and deletes the preset as cleanup.
 *
 * Steps:
 * 1) Open Cloudinary Console → Settings → Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Go to "Optimize and Deliver" tab
 * 4) Set access control to "Restricted"
 * 5) Enter Start date and End date
 * 6) Save the preset
 * 7) Verify details show the restricted access control window
 * 8) Delete the created preset (cleanup)
 */
test('Create Upload Preset with Restricted Access Control (with dates)', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step: Generate preset name and open page
  const presetName = `e2e_restricted_${randomString()}`;
  await presetsPage.goToUploadPresets();

  // Step: Start creation and go to Optimize and Deliver
  await presetsPage.startPresetCreation(presetName);
  await presetsPage.openOptimizeAndDeliver();

  // Step: Calculate dynamic dates for test stability
  const today = new Date();
  const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  const formatDateForInput = (d: Date): string => {
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const formatDateForVerify = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Step: Select Restricted access control with dates
  await UploadPresets.selectDropdownText(page).click();
  await UploadPresets.optionExactText(page, 'Restricted').click();
  await UploadPresets.startDateInput(page).fill(formatDateForInput(startDate));
  await UploadPresets.endDateInput(page).fill(formatDateForInput(endDate));

  // Step: Save preset and wait for row
  const row = await presetsPage.savePresetAndWaitForRow(presetName);

  try {
    // Step: Open details and expand
    await presetsPage.openDetailsWithShowMore(row);

    // Step: Verify restricted configuration text (use regex for flexibility)
    await expect(
      UploadPresets.detailsText(
        page,
        new RegExp(
          `access control: Restricted.*${formatDateForVerify(startDate)}.*${formatDateForVerify(endDate)}`,
          'i',
        ),
      ),
    ).toBeVisible();
  } finally {
    await UploadPresets.pressEscape(page).catch(() => undefined);
    await presetsPage.deletePresetByName(presetName);
  }
});
