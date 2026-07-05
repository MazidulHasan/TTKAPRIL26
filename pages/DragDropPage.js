const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/** Drag & drop page (https://qa.taltektc.com/drag-drop.html). */
class DragDropPage extends BasePage {
  constructor(page) {
    super(page);
    this.dragElement = page.locator('#drag1');
    this.targetDiv = page.locator('#div2');
  }

  async open() {
    await this.goto(this.config.urls.dragDrop);
    return this;
  }

  async dragToTarget() {
    await this.dragElement.dragTo(this.targetDiv);
    return this;
  }

  async expectDropped() {
    await expect(this.targetDiv.locator('#drag1')).toBeVisible();
    return this;
  }
}

module.exports = { DragDropPage };
