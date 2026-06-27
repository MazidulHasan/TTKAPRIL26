import {test, expect} from '@playwright/test';

test('Login test- Valid Data', async ({ page }) => {
    await page.goto('https://qa.taltektc.com/index.html');
    await page.getByRole('textbox',{name: 'Email address or Student ID'}).fill('test1212@gmail.com');
    await page.getByRole('textbox',{name:'Password'}).fill('test1212');
    await page.getByRole('button',{name:'Log In'}).click();

    await expect(page).toHaveURL('https://qa.taltektc.com/home.html');
    await page.getByRole('link', {name:'Drop down (current)'}).click();
    await expect(page).toHaveURL('https://qa.taltektc.com/drop-down.html');

    await page.getByRole('combobox',{name:'Choose a car:'}).selectOption('BMW');
    await page.getByRole('combobox',{name:'Choose a car:'}).selectOption('Audi');
})