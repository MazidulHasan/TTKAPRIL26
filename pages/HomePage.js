const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * Home / dashboard page (https://qa.taltektc.com/home.html).
 * Acts as the navigation hub to every feature page.
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.homeLink = page.getByRole('link', { name: 'Home (current)' });
    // Feature links only render once authenticated, so they make a reliable
    // "am I logged in?" signal (the Home link shows even when signed out).
    this.dropDownLink = page.getByRole('link', { name: 'Drop down (current)' });
  }

  /** Open the home page directly. */
  async open() {
    await this.goto(this.config.urls.home);
    return this;
  }

  /** Assert the user has landed on the authenticated home page. */
  async expectLoaded() {
    await expect(this.dropDownLink).toBeVisible();
    return this;
  }

  /** Navigate by the feature page's href (e.g. 'drag-drop.html'). */
  async navigateByHref(href) {
    await this.page.locator(`//a[@href="${href}"]`).click();
    return this;
  }

  async openDropDown() {
    await this.navigateByHref('drop-down.html');
    return this;
  }

  async openAlert() {
    await this.navigateByHref('alert.html');
    return this;
  }

  async openIframe() {
    await this.navigateByHref('iframe.html');
    return this;
  }

  async openDragDrop() {
    await this.navigateByHref('drag-drop.html');
    return this;
  }

  async openSlider() {
    await this.navigateByHref('slider.html');
    return this;
  }

  async openWindows() {
    await this.navigateByHref('switching-windows.html');
    return this;
  }

  async openRightClick() {
    await this.navigateByHref('right-click-action.html');
    return this;
  }

  async openScrolling() {
    await this.navigateByHref('scrolling-up-down.html');
    return this;
  }

  async openUsersTable() {
    await this.navigateByHref('users-table.html');
    return this;
  }
}

module.exports = { HomePage };
