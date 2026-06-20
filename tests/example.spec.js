// @ts-check

// Import Playwright's test tools.
// "test" is used to create a test case.
// "expect" is used to check the expected result.
import { test, expect } from '@playwright/test';

// This is one test case.
// The text "has title" is the test name shown in the test report.
test('has title', async ({ page }) => {
  // "async" means this test contains steps that may take time.
  // "{ page }" is the browser page Playwright gives to this test.

  // Go to the Playwright website.
  // "await" tells JavaScript to wait until the page is loaded enough to continue.
  await page.goto('https://playwright.dev/');

  // Check the browser page title.
  // This expects the title to contain the word "Playwright".
  // /Playwright/ is a regular expression. Here it simply means:
  // "find the word Playwright anywhere in the title".
  await expect(page).toHaveTitle(/Playwright/);
});

// This is another test case.
// It checks if clicking "Get started" opens the Installation page.
test('get started link', async ({ page }) => {
  // Open the Playwright website again.
  // Each test gets a fresh page, so we open the site in every test.
  await page.goto('https://playwright.dev/');

  // Find a link by its role and visible name, then click it.
  // role: 'link' means Playwright looks for an anchor/link.
  // name: 'Get started' means the link text should be "Get started".
  await page.getByRole('link', { name: 'Get started' }).click();

  // After the click, check that a heading named "Installation" is visible.
  // This confirms that the click took us to the expected page.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
