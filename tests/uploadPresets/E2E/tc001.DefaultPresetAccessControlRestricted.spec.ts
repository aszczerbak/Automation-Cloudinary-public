import { test } from '@playwright/test';
import path from 'path';
import { MediaLibraryPage } from '../../../src/pages/MediaLibraryPage';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC001-DefaultPreset-AccessControl-Restricted
 * Title: Restricted preset -> set ML image default -> upload -> verify Restricted + cleanup
 *
 * Description:
 * Creates a Restricted upload preset, sets it as ML image default, uploads an image via Upload Widget,
 * verifies the uploaded asset shows "Restricted", then deletes the asset.
 *
 * IMPORTANT: This test must run sequentially (not in parallel with other E2E tests) because it sets
 * a preset as ML default. Running multiple tests that modify ML defaults simultaneously causes conflicts.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create Restricted preset (Access control = Restricted + dates)
 * 3) Set ML image default to this preset
 * 4) Open Upload Widget in Media Library and upload a file
 * 5) Open the newest asset
 * 6) Verify permission shows "Restricted"
 * 7) Delete selected asset (cleanup)
 */
test('Upload Presets: restricted preset -> set ML image default -> upload -> verify Restricted + cleanup', async ({
  page,
}) => {
  // Test data: unique preset + file to upload
  const presetName = `restricted_default_${randomString()}`;
  const filePath = path.resolve(process.cwd(), 'src/Files/Lego.jpeg');

  const presetsPage = new UploadPresetsPage(page);
  const mediaLibraryPage = new MediaLibraryPage(page);

  // Step 1-2: Open Upload Presets and create Restricted preset with date range
  await presetsPage.goToUploadPresets();

  const today = new Date();
  const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  await presetsPage.createRestrictedPresetWithDates(presetName, startDate, endDate);

  // Step 3: Set ML image default
  await presetsPage.setMlImageDefault(presetName);

  // Step 4: Open upload widget and upload file
  const uploadWidgetFrame = await mediaLibraryPage.openUploadWidget();
  await mediaLibraryPage.uploadFile(uploadWidgetFrame, filePath);

  // Step 5: Open newest asset
  await mediaLibraryPage.openNewestAsset();

  // Step 6: Assert "Restricted"
  await mediaLibraryPage.assertDeliveryType('Restricted');

  // Step 7: Delete selected asset
  await mediaLibraryPage.deleteSelectedAsset();
});
