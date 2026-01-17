import { test } from '@playwright/test';
import path from 'path';
import { MediaLibraryPage } from '../../../src/pages/MediaLibraryPage';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC003-DefaultPreset-DeliveryType-Private
 * Title: Private preset -> set ML image default -> upload -> verify Private + cleanup
 *
 * Description:
 * Creates a Private upload preset, sets it as ML image default, uploads an image,
 * verifies the asset shows "Private", then deletes the asset.
 *
 * IMPORTANT: This test must run sequentially (not in parallel with other E2E tests) because it sets
 * a preset as ML default. Running multiple tests that modify ML defaults simultaneously causes conflicts.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create Private preset (Delivery type = Private)
 * 3) Set ML image default to this preset
 * 4) Upload an image in Upload Widget
 * 5) Open newest asset
 * 6) Verify asset is Private
 * 7) Delete selected asset (cleanup)
 */
test('Upload Presets: private preset -> set ML image default -> upload -> verify Private + cleanup', async ({
  page,
}) => {
  // Test data: unique preset + file to upload
  const presetName = `private_default_${randomString()}`;
  const filePath = path.resolve(process.cwd(), 'src/Files/Lego.jpeg');

  const presetsPage = new UploadPresetsPage(page);
  const mediaLibraryPage = new MediaLibraryPage(page);

  // Step 1-2: Open Upload Presets and create Private preset
  await presetsPage.goToUploadPresets();
  await presetsPage.createPresetWithDeliveryType(presetName, 'Private');

  // Step 3: Set ML image default
  await presetsPage.setMlImageDefault(presetName);

  // Step 4: Open upload widget and upload file
  const uploadWidgetFrame = await mediaLibraryPage.openUploadWidget();
  await mediaLibraryPage.uploadFile(uploadWidgetFrame, filePath);

  // Step 5: Open newest asset
  await mediaLibraryPage.openNewestAsset();

  // Step 6: Assert "Private"
  await mediaLibraryPage.assertDeliveryType('Private');

  // Step 7: Delete selected asset
  await mediaLibraryPage.deleteSelectedAsset();
});
