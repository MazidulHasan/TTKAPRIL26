const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * Login page for https://qa.taltektc.com/index.html
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.emailInput = page.getByRole('textbox', { name: 'Email address or Student ID' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.errorMessage = page.locator('#error-msg');
  }

  /** Open the login page. */
  async open() {
    await this.goto(this.config.urls.login);
    return this;
  }

  /**
   * Fill credentials and submit.
   * @param {string} [username]
   * @param {string} [password]
   */
  async login(
    username = this.config.credentials.admin.username,
    password = this.config.credentials.admin.password,
  ) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return this;
  }

  /** Wait until the successful-login redirect to the home page completes. */
  async waitForLoggedIn() {
    await this.page.waitForURL(`${this.config.baseURL}${this.config.urls.home}`);
    return this;
  }

  /** Open the page, log in, and wait for the home redirect. */
  async openAndLogin(username, password) {
    await this.open();
    await this.login(username, password);
    await this.waitForLoggedIn();
    return this;
  }

  /** Assert an invalid-login error is shown. */
  async expectInvalidLogin(text = 'Invalid student ID') {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(text);
    return this;
  }
}

module.exports = { LoginPage };
