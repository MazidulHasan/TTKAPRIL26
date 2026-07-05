const { BasePage } = require('./BasePage');

/** Slider page (https://qa.taltektc.com/slider.html). */
class SliderPage extends BasePage {
  constructor(page) {
    super(page);
    this.slider = page.getByRole('slider').first();
    this.range = page.locator('#myRange');
  }

  async open() {
    await this.goto(this.config.urls.slider);
    return this;
  }

  /** Set the slider to a value (0-100). */
  async setValue(value) {
    await this.slider.fill(String(value));
    await this.range.fill(String(value));
    return this;
  }
}

module.exports = { SliderPage };
