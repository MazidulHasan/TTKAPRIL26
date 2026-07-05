const base = require('@playwright/test');
const { config } = require('../config/config');
const {
  LoginPage,
  HomePage,
  DropDownPage,
  AlertPage,
  IframePage,
  DragDropPage,
  SliderPage,
  WindowsPage,
  RightClickPage,
  ScrollPage,
  WebTablePage,
  FileUploadPage,
} = require('../pages');

/**
 * Generic test fixtures.
 *
 * - Injects `config` (URLs, credentials, storage path).
 * - Injects a lazily-instantiated page object for every page in the app,
 *   so specs read `async ({ loginPage }) => ...` instead of `new LoginPage(page)`.
 * - Provides a `loggedInHome` fixture that performs a UI login and lands on
 *   the home page (useful when a test needs a fresh, explicit sign-in rather
 *   than reusing the stored auth state).
 *
 * Authenticated storage state is wired at the project level in
 * playwright.config.js (via the `setup` dependency + `storageState`), so the
 * majority of specs start already signed-in without doing anything.
 */
const test = base.test.extend({
  // Static config available to every test.
  config: async ({}, use) => {
    await use(config);
  },

  // Page objects — one fixture each.
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  dropDownPage: async ({ page }, use) => {
    await use(new DropDownPage(page));
  },
  alertPage: async ({ page }, use) => {
    await use(new AlertPage(page));
  },
  iframePage: async ({ page }, use) => {
    await use(new IframePage(page));
  },
  dragDropPage: async ({ page }, use) => {
    await use(new DragDropPage(page));
  },
  sliderPage: async ({ page }, use) => {
    await use(new SliderPage(page));
  },
  windowsPage: async ({ page }, use) => {
    await use(new WindowsPage(page));
  },
  rightClickPage: async ({ page }, use) => {
    await use(new RightClickPage(page));
  },
  scrollPage: async ({ page }, use) => {
    await use(new ScrollPage(page));
  },
  webTablePage: async ({ page }, use) => {
    await use(new WebTablePage(page));
  },
  fileUploadPage: async ({ page }, use) => {
    await use(new FileUploadPage(page));
  },

  /**
   * Performs a real UI login and hands back the HomePage object already
   * loaded. Use when a test explicitly wants to exercise sign-in or needs
   * a clean session independent of the shared storage state.
   */
  loggedInHome: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.openAndLogin();
    const homePage = new HomePage(page);
    await homePage.expectLoaded();
    await use(homePage);
  },
});

const expect = base.expect;

module.exports = { test, expect };
