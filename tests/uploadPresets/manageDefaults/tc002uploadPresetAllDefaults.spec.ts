import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC002-UploadPresets-ManageDefaults-ML-All
 * Title: Create Upload Preset and set ML image/video/raw defaults
 *
 * Description:
 * Creates an Upload Preset, opens "Manage Defaults", sets the Media Library defaults (image/video/raw)
 * to this preset, and applies defaults. (Further upload/metadata checks can be added later.)
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Save the preset
 * 4) Open preset details link and open "Manage Defaults"
 * 5) Set "ML image", "ML video", "ML raw" defaults to the created preset
 * 6) Click "Set" to apply defaults
 */
test('Upload Presets: set ML image/video/raw defaults', async ({ page }) => {
  // Uploads can exceed 30s depending on network/console load
  test.setTimeout(120_000);

  const presetsPage = new UploadPresetsPage(page);
  const presetName = `e2e_default_${randomString()}`;

  // Step: Open page and start preset creation
  await presetsPage.goToUploadPresets();
  await presetsPage.startPresetCreation(presetName);

  // Step: Enable publicIdAsDisplayName
  await UploadPresets.publicIdAsDisplayNameLabel(page).click();

  // Step: Save preset and wait for row
  await presetsPage.savePresetAndWaitForRow(presetName);

  // Step: Open Manage Defaults for this preset
  await presetsPage.openManageDefaults(presetName);

  // Step: Set ML image default
  const mlImageInput = UploadPresets.mlImageDefaultInput(page);
  await expect(mlImageInput).toBeVisible();
  await mlImageInput.fill(presetName);
  await mlImageInput.press('Enter');

  // Step: Set ML video default
  const mlVideoInput = UploadPresets.mlVideoDefaultInput(page);
  await expect(mlVideoInput).toBeVisible();
  await mlVideoInput.fill(presetName);
  await mlVideoInput.press('Enter');

  // Step: Set ML raw default
  const mlRawInput = UploadPresets.mlRawDefaultInput(page);
  await expect(mlRawInput).toBeVisible();
  await mlRawInput.fill(presetName);
  await mlRawInput.press('Enter');

  // Step: Apply defaults
  const setButton = UploadPresets.setDefaultsButton(page);
  await expect(setButton).toBeVisible();
  await expect(setButton).toBeEnabled();
  await setButton.click();
});
