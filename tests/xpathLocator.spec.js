import {test, expect} from '@playwright/test';

// tag[@attri="value"]
test('Login test- Valid Data_talentTeq', async ({ page }) => {
    await page.goto('https://qa.taltektc.com/index.html');

    await page.locator('//input[@name="email"]').fill('test1212@gmail.com');
    await page.locator('//input[@name="password"]').fill('test1212');
    await page.locator('//input[@class="my-login"]').click();


    await expect(page).toHaveURL('https://qa.taltektc.com/home.html');
    await page.locator('//a[@href="drop-down.html"]').click();
    await expect(page).toHaveURL('https://qa.taltektc.com/drop-down.html');

    await page.locator('//select[@id="cars"]').selectOption('BMW');
})