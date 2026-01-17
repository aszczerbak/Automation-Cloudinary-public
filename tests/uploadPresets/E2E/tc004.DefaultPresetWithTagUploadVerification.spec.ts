import { expect, test } from '@playwright/test';
import path from 'path';
import { MediaLibraryPage } from '../../../src/pages/MediaLibraryPage';
import { UploadPresetsPage } from '../../../src/pages/UploadPresetsPage';
import { MediaLibrary } from '../../../src/selectors/mediaLibrary.selectors';
import { UploadPresets } from '../../../src/selectors/uploadPresets.selectors';
import { randomString } from '../../../src/utils/utils';

/**
 * TC ID: TC004-DefaultPreset-Tag-Upload-Verify
 * Title: Create preset with tag -> set ML image default -> upload -> verify tag in metadata + cleanup
 *
 * Description:
 * Creates an upload preset, adds a tag in "Manage and Analyze", sets it as ML image default,
 * uploads an image via Upload Widget, verifies tag appears in Metadata, then deletes the asset.
 *
 * IMPORTANT: This test must run sequentially (not in parallel with other E2E tests) because it sets
 * a preset as ML default. Running multiple tests that modify ML defaults simultaneously causes conflicts.
 *
 * Steps:
 * 1) Open Upload Presets
 * 2) Create preset + enable publicIdAsDisplayName
 * 3) Go to Manage and Analyze -> add tag -> save
 * 4) Set ML image default for this preset
 * 5) Go to Assets -> open Upload Widget -> upload file
 * 6) Open newest asset -> open Metadata tab
 * 7) Verify tag appears in chips
 * 8) Delete selected asset (cleanup)
 */
test('Upload Presets: create preset with tag, set ML image default, upload image, verify tag in metadata', async ({
  page,
}) => {
  // Test data: unique preset name + tag + file to upload
  const presetName = `e2e_default_${randomString()}`;
  const tagName = `e2e-tag-${randomString()}`;
  const filePath = path.resolve(process.cwd(), 'src/Files/Lego.jpeg');

  const presetsPage = new UploadPresetsPage(page);
  const mediaLibraryPage = new MediaLibraryPage(page);

  // Step 1-2: Open Upload Presets and create preset with tag
  await presetsPage.goToUploadPresets();
  await presetsPage.startPresetCreation(presetName);
  await UploadPresets.publicIdAsDisplayNameLabel(page).click();

  // Step 3: Go to Manage and Analyze and add tag
  await presetsPage.openManageAndAnalyze();
  await UploadPresets.tagsDropdownLegacy(page).click();
  await UploadPresets.tagsComboboxInput(page).fill(tagName);
  await UploadPresets.tagsFirstOptionPrimaryContent(page).click();

  // Save preset
  await presetsPage.savePresetAndWaitForRow(presetName);

  // Step 4: Set ML image default
  await presetsPage.setMlImageDefault(presetName);

  // Step 5: Open upload widget and upload file
  const uploadWidgetFrame = await mediaLibraryPage.openUploadWidget();
  await mediaLibraryPage.uploadFile(uploadWidgetFrame, filePath);

  // Step 6: Open newest asset
  await mediaLibraryPage.openNewestAsset();

  // Open Metadata tab
  await MediaLibrary.metadataTab(page).click();

  // Step 7: Verify tag chip contains tagName
  await expect(MediaLibrary.chipValue(page)).toContainText(tagName);

  // Step 8: Delete selected asset (cleanup)
  await mediaLibraryPage.deleteSelectedAsset();
});
