const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/** Switching windows page (https://qa.taltektc.com/switching-windows.html). */
class WindowsPage extends BasePage {
  constructor(page) {
    super(page);
    this.newTabButton = page.getByRole('button', { name: 'New Tab' });
    this.newWindowButton = page.getByRole('button', { name: 'New Window' });
  }

  async open() {
    await this.goto(this.config.urls.windows);
    return this;
  }

  /** Click "New Tab" and return the resulting popup page. */
  async openNewTab() {
    const popupPromise = this.page.waitForEvent('popup');
    await this.newTabButton.click();
    return popupPromise;
  }

  /** Click "New Window" and return the resulting popup page. */
  async openNewWindow() {
    const popupPromise = this.page.waitForEvent('popup');
    await this.newWindowButton.click();
    return popupPromise;
  }

  async expectNewTabHeading(popup) {
    await expect(popup.getByRole('heading', { name: 'This is a new tab' })).toBeVisible();
    return this;
  }
}

module.exports = { WindowsPage };
