import {test, expect} from '@playwright/test';

test('File upload', async ({ page }) => {
    await page.goto('https://demo.automationtesting.in/FileUpload.html');
    await page.getByRole('button', { name: 'Choose File' }).setInputFiles('ss1.png');
    await expect(page.locator('#preview-1783179121973-0')).toContainText('(167.5 KB)');
    // await expect(page.getByRole(......)) fix it yourself
})