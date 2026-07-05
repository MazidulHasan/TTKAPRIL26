const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/** File upload page (external demo: demo.automationtesting.in/FileUpload.html). */
class FileUploadPage extends BasePage {
  constructor(page) {
    super(page);
    this.chooseFileButton = page.getByRole('button', { name: 'Choose File' });
  }

  async open() {
    await this.goto(this.config.external.fileUpload);
    return this;
  }

  /** Upload one or more files. */
  async uploadFile(files) {
    await this.chooseFileButton.setInputFiles(files);
    return this;
  }

  async expectPreviewContains(selector, text) {
    await expect(this.page.locator(selector)).toContainText(text);
    return this;
  }
}

module.exports = { FileUploadPage };
