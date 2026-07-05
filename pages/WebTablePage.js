const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/** Users web table page (https://qa.taltektc.com/users-table.html). */
class WebTablePage extends BasePage {
  constructor(page) {
    super(page);
  }

  async open() {
    await this.goto(this.config.urls.usersTable);
    return this;
  }

  /** Returns the cell locator for a given text. */
  cell(text) {
    return this.page.getByRole('cell', { name: text });
  }

  async expectUserVisible(email) {
    await expect(this.cell(email)).toBeVisible();
    return this;
  }
}

module.exports = { WebTablePage };
