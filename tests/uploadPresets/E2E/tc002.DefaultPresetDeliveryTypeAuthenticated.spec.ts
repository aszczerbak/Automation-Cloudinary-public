import { test } from '@playwright/test';
import path from 'path';
import { MediaLibraryPage } from '../../../src/pages/MediaLibraryPage';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC002-DefaultPreset-DeliveryType-Authenticated
 * Title: Authenticated preset -> set ML image default -> upload -> verify Authenticated + cleanup
 *
 * Description:
 * Creates an Authenticated upload preset, sets it as ML image default, uploads an image,
 * verifies the asset shows "Authenticated", then deletes the asset.
 *
 * IMPORTANT: This test must run sequentially (not in parallel with other E2E tests) because it sets
 * a preset as ML default. Running multiple tests that modify ML defaults simultaneously causes conflicts.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create Authenticated preset (Delivery type = Authenticated)
 * 3) Set ML image default to this preset
 * 4) Upload an image in Upload Widget
 * 5) Open newest asset
 * 6) Verify asset is Authenticated
 * 7) Delete selected asset (cleanup)
 */
test('Upload Presets: authenticated preset -> set ML image default -> upload -> verify Authenticated + cleanup', async ({
  page,
}) => {
  // Test data: unique preset + file to upload
  const presetName = `authenticated_default_${randomString()}`;
  const filePath = path.resolve(process.cwd(), 'src/Files/Lego.jpeg');

  const presetsPage = new UploadPresetsPage(page);
  const mediaLibraryPage = new MediaLibraryPage(page);

  // Step 1-2: Open Upload Presets and create Authenticated preset
  await presetsPage.goToUploadPresets();
  await presetsPage.createPresetWithDeliveryType(presetName, 'Authenticated');

  // Step 3: Set ML image default
  await presetsPage.setMlImageDefault(presetName);

  // Step 4: Open upload widget and upload file
  const uploadWidgetFrame = await mediaLibraryPage.openUploadWidget();
  await mediaLibraryPage.uploadFile(uploadWidgetFrame, filePath);

  // Step 5: Open newest asset
  await mediaLibraryPage.openNewestAsset();

  // Step 6: Assert "Authenticated"
  await mediaLibraryPage.assertDeliveryType('Authenticated');

  // Step 7: Delete selected asset
  await mediaLibraryPage.deleteSelectedAsset();
});
