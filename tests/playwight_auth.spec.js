import { test, expect } from '@playwright/test';

test.use({
  storageState: 'playwright/.auth/user.json'
});


test('Going to drop down page', async ({ page }) => {
    await page.goto('https://qa.taltektc.com/index.html');
    await page.locator('//a[@href="drag-drop.html"]').click();
});
