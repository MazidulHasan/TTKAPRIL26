const { expect } = require('@playwright/test');
const { config } = require('../config/config');

/**
 * BasePage holds functionality shared by every page object:
 * navigation, common waits and thin wrappers around the most used
 * Playwright actions. Every concrete page object extends this class.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.config = config;
  }

  /** Resolve a path (relative to baseURL) or absolute URL into a full URL. */
  resolve(path = '/') {
    return path.startsWith('http')
      ? path
      : `${config.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  /**
   * Navigate to a path (relative to baseURL) or an absolute URL.
   *
   * Self-healing auth: the app guards feature pages with a short-lived access
   * token and bounces expired/contended sessions back to the login page. If
   * that happens while navigating to an in-app page, we transparently sign in
   * again and retry once, so tests don't flake under parallel load.
   * @param {string} path
   */
  async goto(path = '/') {
    await this.page.goto(this.resolve(path));
    await this.#ensureAuthenticated(path);
    return this;
  }

  /** Private: recover from an auth bounce back to the login page. */
  async #ensureAuthenticated(path) {
    const loginPath = config.urls.login;

    // We intentionally navigated to the login page — nothing to recover.
    if (path.includes(loginPath) || path.startsWith('http')) return;

    // Give a client-side auth guard a moment to run and possibly redirect.
    await this.page.waitForLoadState('networkidle').catch(() => {});
    if (!this.page.url().includes(loginPath)) return;

    // Bounced to login: sign in with the default admin user, then retry.
    // Lazy require avoids a circular dependency (LoginPage extends BasePage).
    const { LoginPage } = require('./LoginPage');
    const loginPage = new LoginPage(this.page);
    await loginPage.login();
    await loginPage.waitForLoggedIn();
    await this.page.goto(this.resolve(path));
  }

  /** Current page URL. */
  url() {
    return this.page.url();
  }

  /** Page title. */
  async title() {
    return this.page.title();
  }

  /** Wait until the network has been idle. */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  /** Assert the current URL equals the expected URL (relative or absolute). */
  async expectUrl(expected) {
    const full = expected.startsWith('http')
      ? expected
      : `${config.baseURL}${expected}`;
    await expect(this.page).toHaveURL(full);
    return this;
  }

  /** Take a named screenshot into the scratch/screenshots folder. */
  async screenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    return this;
  }
}

module.exports = { BasePage };
