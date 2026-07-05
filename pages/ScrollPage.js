const { BasePage } = require('./BasePage');

/** Scrolling page (https://qa.taltektc.com/scrolling-up-down.html). */
class ScrollPage extends BasePage {
  constructor(page) {
    super(page);
    this.scrollBox = page.locator('.scrollable-box');
  }

  async open() {
    await this.goto(this.config.urls.scrolling);
    return this;
  }

  /** Scroll inside the scrollable box using the mouse wheel. */
  async scrollBoxBy(steps = 50, deltaY = 20, delayMs = 20) {
    await this.scrollBox.hover();
    for (let i = 0; i < steps; i += 1) {
      await this.page.mouse.wheel(0, deltaY);
      await this.page.waitForTimeout(delayMs);
    }
    return this;
  }
}

module.exports = { ScrollPage };
