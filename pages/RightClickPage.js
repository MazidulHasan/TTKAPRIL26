const { BasePage } = require('./BasePage');

/** Right click page (https://qa.taltektc.com/right-click-action.html). */
class RightClickPage extends BasePage {
  constructor(page) {
    super(page);
    this.rightClickButton = page.getByRole('button', { name: 'Right click me' });
  }

  async open() {
    await this.goto(this.config.urls.rightClick);
    return this;
  }

  async rightClick() {
    await this.rightClickButton.click({ button: 'right' });
    return this;
  }
}

module.exports = { RightClickPage };
