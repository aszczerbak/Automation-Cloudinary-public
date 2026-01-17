import { expect, test } from '@playwright/test';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC001-UploadPresets-ManageDefaults-ML-Image
 * Title: Create Upload Preset and set ML image default
 *
 * Description:
 * Creates an Upload Preset, opens "Manage Defaults", sets the Media Library image default to this preset,
 * and applies defaults. (Further upload/metadata checks can be added later.)
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create a new Upload Preset with a unique name
 * 3) Save the preset
 * 4) Open preset details link and open "Manage Defaults"
 * 5) Set "ML image" default to the created preset
 * 6) Click "Set" to apply defaults
 */
test('Upload Presets: set ML image default', async ({ page }) => {
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

  // Step: Set ML image default to this preset
  const mlImageInput = UploadPresets.mlImageDefaultInput(page);
  await expect(mlImageInput).toBeVisible();
  await mlImageInput.fill(presetName);
  await mlImageInput.press('Enter');

  // Step: Apply defaults
  const setButton = UploadPresets.setDefaultsButton(page);
  await expect(setButton).toBeVisible();
  await expect(setButton).toBeEnabled();
  await setButton.click();
});
