const { BasePage } = require('./BasePage');

/** Alerts & modals page (https://qa.taltektc.com/alert.html). */
class AlertPage extends BasePage {
  constructor(page) {
    super(page);
    this.tryItButton = page.getByRole('button', { name: 'Try it' });
    this.openSmallModalButton = page.getByRole('button', { name: 'Open Small Modal' });
    this.smallModal = page.getByRole('dialog', { name: 'Small Modal' });
  }

  async open() {
    await this.goto(this.config.urls.alert);
    return this;
  }

  /**
   * Handle the next JS dialog then trigger it.
   * @param {'accept'|'dismiss'} action
   */
  async triggerAlert(action = 'dismiss') {
    this.page.once('dialog', (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      if (action === 'accept') {
        dialog.accept().catch(() => {});
      } else {
        dialog.dismiss().catch(() => {});
      }
    });
    await this.tryItButton.click();
    return this;
  }

  async openSmallModal() {
    await this.openSmallModalButton.click();
    return this;
  }

  async closeSmallModal() {
    await this.smallModal.getByText('Close').click();
    return this;
  }
}

module.exports = { AlertPage };
