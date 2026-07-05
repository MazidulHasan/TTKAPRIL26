import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { config } from '../config/config';

/**
 * Authentication setup project. Runs once before the POM test project and
 * persists an authenticated browser storage state to disk. Every subsequent
 * test reuses it via `storageState` in playwright.config.js, so they start
 * already signed-in.
 */
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.openAndLogin();
  await homePage.expectLoaded();

  await page.context().storageState({ path: config.storageState });
});
