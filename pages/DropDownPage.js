const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/** Drop down page (https://qa.taltektc.com/drop-down.html). */
class DropDownPage extends BasePage {
  constructor(page) {
    super(page);
    this.carsSelect = page.getByRole('combobox', { name: 'Choose a car:' });
  }

  async open() {
    await this.goto(this.config.urls.dropDown);
    return this;
  }

  /** Select a car by its visible option / value. */
  async selectCar(option) {
    await this.carsSelect.selectOption(option);
    return this;
  }

  /** Assert by the option's underlying value attribute. */
  async expectSelected(value) {
    await expect(this.carsSelect).toHaveValue(value);
    return this;
  }

  /**
   * Assert by the visible option label. Preferred for this page because the
   * option labels and their value attributes intentionally differ
   * (e.g. label "BMW" has value "saab").
   */
  async expectSelectedLabel(label) {
    await expect(this.carsSelect.locator('option:checked')).toHaveText(label);
    return this;
  }
}

module.exports = { DropDownPage };
