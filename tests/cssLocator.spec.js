import {test, expect} from '@playwright/test';


// id: #
// class: .
// for other: [attribute="value"]

test('Login test- Valid Data', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
})

test('Login test- Valid Data_talentTeq', async ({ page }) => {
    await page.goto('https://qa.taltektc.com/index.html');

    await page.locator('[name="email"]').fill('test1212@gmail.com');
    await page.locator('[name="password"]').fill('test1212');
    await page.locator('.my-login').click();

    await expect(page).toHaveURL('https://qa.taltektc.com/home.html');
    await page.locator('[href="drop-down.html"]').click();
    await expect(page).toHaveURL('https://qa.taltektc.com/drop-down.html');

    await page.locator('#cars').selectOption('BMW');
})