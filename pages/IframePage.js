const { BasePage } = require('./BasePage');

/** Iframe page (https://qa.taltektc.com/iframe.html). */
class IframePage extends BasePage {
  constructor(page) {
    super(page);
    this.frame = page.locator('//iframe[@title="TALENT TEK"]').contentFrame();
    this.playButton = this.frame.getByRole('button', { name: 'Play video' });
    this.pauseButton = this.frame.getByRole('button', { name: 'Pause video' });
  }

  async open() {
    await this.goto(this.config.urls.iframe);
    return this;
  }

  async playVideo() {
    await this.playButton.click();
    return this;
  }

  async pauseVideo() {
    await this.pauseButton.click();
    return this;
  }
}

module.exports = { IframePage };
