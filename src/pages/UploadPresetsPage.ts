import { expect, type Locator, type Page } from '@playwright/test';
import { UploadPresets } from '../selectors/uploadPresets.selectors';

export class UploadPresetsPage {
  constructor(public readonly page: Page) {}

  async goToUploadPresets(): Promise<void> {
    await this.page.goto(UploadPresets.url, { waitUntil: 'domcontentloaded' });
  }

  async savePresetAndWaitForRow(presetName: string, timeoutMs = 15_000): Promise<Locator> {
    const row = UploadPresets.rowByNameHasText(this.page, presetName);

    await UploadPresets.saveButton(this.page).click();

    // Modal closes after saving; wait so the table can refresh before asserting the row.
    await expect(UploadPresets.uploadPresetNameInput(this.page))
      .toBeHidden({ timeout: 10_000 })
      .catch(() => undefined);

    await expect(row).toHaveCount(1, { timeout: timeoutMs });
    return row;
  }

  async startPresetCreation(name: string): Promise<void> {
    await UploadPresets.addUploadPresetButton(this.page).click();
    await UploadPresets.uploadPresetNameInput(this.page).fill(name);
  }

  async openAdvancedTab(): Promise<void> {
    await UploadPresets.advancedTab(this.page).click();
  }

  async openOptimizeAndDeliver(): Promise<void> {
    const tab = UploadPresets.optimizeAndDeliverTab(this.page);
    await tab.waitFor({ state: 'visible', timeout: 10_000 });
    await tab.click();

    // Best-effort verification the tab switched
    await expect(tab)
      .toHaveAttribute('aria-selected', 'true', { timeout: 5_000 })
      .catch(() => undefined);
  }

  async openTransformTab(): Promise<void> {
    const tab = UploadPresets.transformTab(this.page);
    await tab.waitFor({ state: 'visible', timeout: 10_000 });
    await tab.click();

    // Best-effort verification the tab switched
    await expect(tab)
      .toHaveAttribute('aria-selected', 'true', { timeout: 5_000 })
      .catch(() => undefined);
  }

  async openManageDefaults(presetName: string): Promise<void> {
    await UploadPresets.linkButtonInNameCell(this.page, presetName).click();
    await UploadPresets.manageDefaultsButton(this.page).click();
    await expect(UploadPresets.defaultsForm(this.page)).toBeVisible();
  }

  async ensureSwitchOn(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    const current = await locator.getAttribute('aria-checked');
    if (current !== 'true') {
      await locator.click();
    }
    await expect(locator).toHaveAttribute('aria-checked', 'true');
  }

  async ensureSwitchOff(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    const current = await locator.getAttribute('aria-checked');
    if (current === 'true') {
      await locator.click();
    }
    await expect(locator).toHaveAttribute('aria-checked', 'false');
  }

  async expandShowMoreIfVisible(): Promise<void> {
    const showMore = UploadPresets.showMoreButton(this.page);
    if (await showMore.isVisible().catch(() => false)) {
      await showMore.click();
    }
  }

  async openDetailsWithShowMore(row: Locator): Promise<void> {
    await row.first().click();
    const showMore = UploadPresets.showMoreButton(this.page);
    if (await showMore.isVisible().catch(() => false)) {
      await showMore.click();
    }
  }

  async openManageAndAnalyze(): Promise<void> {
    const tab = UploadPresets.manageAndAnalyzeTab(this.page);
    await tab.waitFor({ state: 'visible', timeout: 10_000 });
    await tab.click();

    // Best-effort verification the tab switched
    await expect(tab)
      .toHaveAttribute('aria-selected', 'true', { timeout: 5_000 })
      .catch(() => undefined);
  }

  async deletePresetByName(presetName: string): Promise<void> {
    // Encapsulates the row menu -> delete -> confirm flow used by many specs
    const rowByRole = UploadPresets.rowByRoleName(this.page, presetName);
    await UploadPresets.rowMenuToggle(rowByRole).click();
    await UploadPresets.cldsMenuDelete(this.page).click();
    await UploadPresets.confirmDeleteButton(this.page).click();
    await expect(UploadPresets.rowByNameHasText(this.page, presetName)).toHaveCount(0);
  }

  /**
   * Creates a preset with specified delivery type (Authenticated, Private, or Public).
   * Enables publicIdAsDisplayName and sets the delivery type in Optimize and Deliver tab.
   * @param presetName - Name of the preset to create
   * @param deliveryType - 'Authenticated', 'Private', or 'Public'
   */
  async createPresetWithDeliveryType(
    presetName: string,
    deliveryType: 'Authenticated' | 'Private' | 'Public',
  ): Promise<void> {
    await this.startPresetCreation(presetName);
    await UploadPresets.publicIdAsDisplayNameLabel(this.page).click();
    await this.openOptimizeAndDeliver();
    await UploadPresets.deliveryTypeDropdownLegacy(this.page).click();
    await UploadPresets.optionExactText(this.page, deliveryType).click();
    await this.savePresetAndWaitForRow(presetName);
  }

  /**
   * Creates a Restricted preset with date range for access control.
   * Enables publicIdAsDisplayName and sets start/end dates.
   * @param presetName - Name of the preset to create
   * @param startDate - Start date for restricted access
   * @param endDate - End date for restricted access
   */
  async createRestrictedPresetWithDates(presetName: string, startDate: Date, endDate: Date): Promise<void> {
    await this.startPresetCreation(presetName);
    await UploadPresets.publicIdAsDisplayNameLabel(this.page).click();
    await this.openOptimizeAndDeliver();
    await UploadPresets.selectDropdownText(this.page).click();
    await UploadPresets.optionExactText(this.page, 'Restricted').click();

    // Format dates as "DD MMM YYYY" (e.g., "17 Jan 2026")
    const formatDate = (d: Date): string => {
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    };

    await UploadPresets.startDateInput(this.page).fill(formatDate(startDate));
    await UploadPresets.endDateInput(this.page).fill(formatDate(endDate));

    await this.savePresetAndWaitForRow(presetName);
  }

  /**
   * Sets the Media Library image default to the specified preset.
   * Opens Manage Defaults modal, fills preset name, and applies.
   * @param presetName - Name of the preset to set as ML image default
   */
  async setMlImageDefault(presetName: string): Promise<void> {
    await this.openManageDefaults(presetName);
    await UploadPresets.mlImageDefaultInput(this.page).fill(presetName);
    await UploadPresets.mlImageDefaultInput(this.page).press('Enter');

    const setButton = UploadPresets.setDefaultsButton(this.page);
    await expect(setButton).toBeEnabled();
    await setButton.click();
  }
}
