import { test, expect } from '@playwright/test'

test('Verify the title of login page', async ({ page }) => {
    await page.goto('https://qa.taltektc.com/');
    await expect(page).toHaveTitle('Login');
})