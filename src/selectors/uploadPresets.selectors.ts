import type { Locator, Page } from '@playwright/test';

/**
 * Upload Presets - selectors/locators used by tests.
 * Intentionally kept 1:1 with existing selectors to avoid breaking working tests.
 */
export const UploadPresets = {
  // =========================
  // URLs
  // =========================
  url: 'https://console.cloudinary.com/app/settings/upload/presets',

  // =========================
  // Table
  // =========================
  table: (page: Page): Locator => page.locator('[data-test="upload-presets-list"]'),
  tableRows: (page: Page): Locator =>
    page.locator('[data-test="upload-presets-list"] tbody tr[data-test="upload-preset-row"]'),
  rowByNameHasText: (page: Page, presetName: string): Locator =>
    page.locator('table tbody tr', { hasText: presetName }),

  rowByRoleName: (page: Page, presetName: string): Locator => page.getByRole('row', { name: presetName }),
  rowByRoleRegex: (page: Page, presetName: string): Locator => page.getByRole('row', { name: new RegExp(presetName) }),

  nameCell: (page: Page, presetName: string): Locator => page.getByRole('cell', { name: presetName }),

  linkButtonInNameCell: (page: Page, presetName: string): Locator =>
    page.getByRole('cell', { name: presetName }).locator('[data-test="link-button"]'),

  // Sort headers
  sortByNameHeader: (page: Page): Locator => page.locator('[data-test="sort-by-name"]'),
  sortByDateHeader: (page: Page): Locator => page.locator('[data-test="sort-by-date"]'),
  sortDirectionIcon: (page: Page): Locator => page.locator('[data-test="sort-direction-desc"]'),

  // =========================
  // Create preset modal
  // =========================
  addUploadPresetButton: (page: Page): Locator => page.getByRole('button', { name: 'Add Upload Preset' }),
  uploadPresetNameInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Upload preset name' }),
  publicIdAsDisplayNameLabel: (page: Page): Locator => page.locator('label[for="publicIdAsDisplayName"]'),
  saveButton: (page: Page): Locator => page.getByRole('button', { name: 'Save' }),

  // =========================
  // Tabs
  // =========================
  optimizeAndDeliverTab: (page: Page): Locator => page.getByRole('button', { name: 'Optimize and Deliver' }),
  manageAndAnalyzeTab: (page: Page): Locator => page.getByRole('button', { name: 'Manage and Analyze' }),
  advancedTab: (page: Page): Locator => page.getByRole('button', { name: 'Advanced' }),
  transformTab: (page: Page): Locator => page.getByRole('button', { name: /transform/i }),

  // =========================
  // General tab controls
  // =========================
  overwriteSwitch: (page: Page): Locator => page.getByRole('switch', { name: /overwrite/i }),

  appendUniqueSuffixSwitch: (page: Page): Locator => page.getByRole('switch', { name: /append a unique suffix/i }),

  prependPathToPublicIdSwitch: (page: Page): Locator =>
    page.getByRole('switch', { name: /prepend a path to the public/i }),

  useFilenameAsPublicIdRadio: (page: Page): Locator =>
    page.getByRole('radio', { name: 'Use the filename of the uploaded file as the public ID' }),

  useCustomPathRadio: (page: Page): Locator => page.getByRole('radio', { name: 'Use a custom path' }),

  customPublicIdPrefixPathInput: (page: Page): Locator =>
    page.getByRole('textbox', { name: 'Custom public ID prefix path' }),

  assetFolderInput: (page: Page): Locator => page.getByRole('textbox', { name: /asset folder/i }),

  // =========================
  // Signing mode (existing selector pattern)
  // =========================
  signingModeSingleValue: (page: Page): Locator => page.locator('.cb__single-value'),
  comboboxInputVisible: (page: Page): Locator => page.locator('[data-test="combobox-input"]:visible').first(),

  // =========================
  // Optimize & Deliver controls
  // =========================
  deliveryTypeDropdownLegacy: (page: Page): Locator =>
    page
      .locator('div')
      .filter({ hasText: /^Upload$/ })
      .nth(5),

  selectDropdownText: (page: Page): Locator => page.getByText('Select...'),

  optionExactText: (page: Page, label: string): Locator => page.getByText(label, { exact: true }),

  formatInput: (page: Page): Locator => page.locator('#format'),
  allowedFormatsInput: (page: Page): Locator => page.locator('#allowed_formats'),

  discardOriginalFileNameSwitch: (page: Page): Locator =>
    page.getByRole('switch', { name: /discard original file name/i }).first(),
  discardOriginalFileNameLabelFallback: (page: Page): Locator => page.getByText(/discard original file name/i).first(),

  startDateInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Start date' }),
  endDateInput: (page: Page): Locator => page.getByRole('textbox', { name: 'End date' }),

  // =========================
  // Search
  // =========================
  searchInput: (page: Page): Locator => page.locator('[data-test="text-field"]').first(),
  searchIcon: (page: Page): Locator => page.locator('[data-test="search-icon"]'),

  // =========================
  // Manage Defaults
  // =========================
  manageDefaultsButton: (page: Page): Locator => page.getByRole('button', { name: 'Manage Defaults' }),
  defaultsForm: (page: Page): Locator => page.locator('#defaults-form'),

  mlImageDefaultInput: (page: Page): Locator => page.locator('#media_library-image'),
  mlVideoDefaultInput: (page: Page): Locator => page.locator('#media_library-video'),
  mlRawDefaultInput: (page: Page): Locator => page.locator('#media_library-raw'),

  setDefaultsButton: (page: Page): Locator => page.locator('[data-test="set-button"]'),

  // =========================
  // Advanced switches
  // =========================
  asyncSwitch: (page: Page): Locator => page.getByRole('switch', { name: /async/i }),
  invalidateSwitch: (page: Page): Locator => page.getByRole('switch', { name: /invalidate/i }),
  returnDeleteTokenSwitch: (page: Page): Locator => page.getByRole('switch', { name: /return delete token/i }),

  // =========================
  // Advanced text fields
  // =========================
  notificationUrlInput: (page: Page): Locator => page.getByRole('textbox', { name: /notification url/i }),
  evalScriptInput: (page: Page): Locator => page.getByRole('textbox', { name: /eval script/i }),
  onSuccessScriptInput: (page: Page): Locator => page.getByRole('textbox', { name: /on success script/i }),
  proxyInput: (page: Page): Locator => page.getByRole('textbox', { name: /proxy/i }),
  headersInput: (page: Page): Locator => page.getByRole('textbox', { name: /headers/i }),

  // =========================
  // Transform tab fields
  // =========================
  transformationInput: (page: Page): Locator => page.locator('#transformation'),
  eagerTransformation0Input: (page: Page): Locator => page.locator('#eagerTransformation-0'),

  // =========================
  // Manage & Analyze - switches (selectors based on existing POM)
  // =========================
  manualModerationSwitch: (page: Page): Locator => page.getByRole('switch', { name: /manual moderation/i }),

  retrieveFacesCoordinatesSwitch: (page: Page): Locator =>
    page.getByRole('switch', { name: /retrieve faces coordinates/i }),

  computePerceptualHashSwitch: (page: Page): Locator => page.getByRole('switch', { name: /compute perceptual hash/i }),

  qualityAnalysisSwitch: (page: Page): Locator => page.getByRole('switch', { name: /retrieve quality analysis data/i }),

  predominantColorsSwitch: (page: Page): Locator => page.getByRole('switch', { name: /retrieve predominant colors/i }),

  retrieveMediaMetadataSwitch: (page: Page): Locator => page.getByRole('switch', { name: /retrieve media metadata/i }),

  autoChapteringSwitch: (page: Page): Locator => page.getByRole('switch', { name: /auto chaptering/i }),

  autoTranscriptionSwitch: (page: Page): Locator => page.getByRole('switch', { name: /auto transcription/i }),

  translateSwitch: (page: Page): Locator => page.getByRole('switch', { name: /translate/i }),

  autoVideoDetailsSwitch: (page: Page): Locator => page.getByRole('switch', { name: /auto video details/i }),

  // language selection flow used in existing POM:
  // page.getByText('Select...').nth(1).click();
  autoTranscriptionSelectNth1: (page: Page): Locator => page.getByText('Select...').nth(1),

  autoTranscriptionLanguagesInput: (page: Page): Locator => page.locator('#auto_transcription_languages'),

  // =========================
  // Manage & Analyze - tags controls (kept 1:1 with tc006)
  // =========================
  tagsDropdownLegacy: (page: Page): Locator =>
    page
      .locator('div')
      .filter({ hasText: /^Select\.\.\.$/ })
      .nth(2),

  tagsComboboxInput: (page: Page): Locator => page.locator('[data-test="combobox-input"]'),

  tagsFirstOptionPrimaryContent: (page: Page): Locator => page.locator('[data-test="item--primary-content"]'),

  // =========================
  // Manage & Analyze - context key/value
  // =========================
  contextKeyInput: (page: Page): Locator => page.locator('input[name="key"]'),
  contextValueInput: (page: Page): Locator => page.locator('input[name="value"]'),
  contextAddButton: (page: Page): Locator => page.getByRole('button', { name: 'Add', exact: true }),

  // =========================
  // Details panel
  // =========================
  showMoreButton: (page: Page): Locator => page.getByRole('button', { name: /show more/i }).first(),

  detailsText: (page: Page, textOrRegex: string | RegExp): Locator => page.getByText(textOrRegex).first(),

  detailsTbody: (page: Page): Locator => page.locator('tbody'),

  // =========================
  // Row menu + deletion
  // =========================
  rowMenuToggle: (row: Locator): Locator => row.getByLabel(/toggle upload preset menu/i),
  modeChip: (row: Locator): Locator => row.locator('[data-test="chip"]'),

  cldsMenu: (page: Page): Locator => page.getByTestId('clds-menu'),
  cldsMenuDelete: (page: Page): Locator => page.getByTestId('clds-menu').getByText('Delete'),
  confirmDeleteButton: (page: Page): Locator => page.getByRole('button', { name: 'Delete' }),

  // =========================
  // Common actions
  // =========================
  pressEscape: async (page: Page): Promise<void> => {
    await page.keyboard.press('Escape');
  },
} as const;
