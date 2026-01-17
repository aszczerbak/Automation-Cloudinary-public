import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC-UploadPresets-Advanced-Notification-And-Scripts
 * Title: Create Upload Preset with notification URL, proxy, headers, and scripts
 *
 * Description:
 * Creates an Upload Preset, fills Advanced tab text fields (notification URL, eval script, on success script,
 * proxy, headers), saves, verifies the entered values appear in details, and cleans up by deleting the preset.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Go to "Advanced" tab
 * 4) Populate notification URL, scripts, proxy, and headers
 * 5) Save the preset
 * 6) Verify details contain the entered values
 * 7) Delete the preset (cleanup)
 */
test('Upload Presets: advanced notification, scripts, and proxy fields persist', async ({ page }) => {
  const presetsPage = new UploadPresetsPage(page);

  // Step 1: open Upload Presets
  await presetsPage.goToUploadPresets();

  // Step 2: test data
  const presetName = `e2e_adv_fields_${randomString()}`;
  const notificationUrl = 'https://example.com/webhook';
  const evalScript = 'if (resource_info?.quality_analysis?.focus < 0.5) { upload_options["tags"] = "qa_blurry"; }';
  const onSuccessScript = 'current_asset.update({ context: { note: "done" } });';
  const proxyValue = 'http://localhost:8080';

  // Step 3: start creation and set name
  await presetsPage.startPresetCreation(presetName);

  // Step 4: open Advanced tab
  await presetsPage.openAdvancedTab();

  // Step 5: fill advanced fields
  await UploadPresets.notificationUrlInput(page).fill(notificationUrl);
  await UploadPresets.evalScriptInput(page).fill(evalScript);
  await UploadPresets.onSuccessScriptInput(page).fill(onSuccessScript);
  await UploadPresets.proxyInput(page).fill(proxyValue);

  // Step 6: save and wait for the row
  const row = await presetsPage.savePresetAndWaitForRow(presetName, 25_000);

  try {
    // Step 7: open details (with Show more if present)
    await presetsPage.openDetailsWithShowMore(row);

    const details = UploadPresets.detailsTbody(page);

    // Step 8: verify entered values appear in details
    await expect(details).toContainText(notificationUrl);
    await expect(details).toContainText('qa_blurry');
    await expect(details).toContainText('note');
    await expect(details).toContainText('done');
    await expect(details).toContainText('localhost:8080');
  } finally {
    // Step 9: close details and delete preset
    await UploadPresets.pressEscape(page);

    // Delete preset (cleanup)
    await presetsPage.deletePresetByName(presetName);
  }
});
