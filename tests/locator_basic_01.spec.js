import {test, expect} from '@playwright/test';

test('Login test- basic', async ({ page }) => {
    await page.goto('https://qa.taltektc.com/index.html');
    await page.getByRole('textbox',{name: 'Email address or Student ID'}).fill('tempdata');
    await page.getByRole('textbox',{name:'Password'}).fill('tempdata');
    await page.getByRole('button',{name:'Log In'}).click();
})

// use of first class or user first locator
test('Login test- invalid login test', async ({ page }) => {
    await page.goto('https://qa.taltektc.com/index.html');
    await page.getByRole('textbox',{name: 'Email address or Student ID'}).fill('tempdata');
    await page.getByRole('textbox',{name:'Password'}).fill('tempdata');
    await page.getByRole('button',{name:'Log In'}).click();

    // await expect(page.getByText('Invalid student ID')).toBeVisible();
    await expect(page.getByRole('paragraph')).toContainText('Invalid student ID');
})

// css locator
test.skip('Login test- invalid login test_ For css locator', async ({ page }) => {
    await page.goto('https://qa.taltektc.com/index.html');
    await page.getByRole('textbox',{name: 'Email address or Student ID'}).fill('tempdata');
    await page.getByRole('textbox',{name:'Password'}).fill('tempdata');
    await page.getByRole('button',{name:'Log In'}).click();

    // await expect(page.getByText('Invalid student ID')).toBeVisible();
    // id: #
    // class: .
    // for other: [attribute="value"]
    await expect(page.locator('#error-msg')).toHaveText('Invalid student ID');
})


test('Login test- invalid login test _ for Xpath', async ({ page }) => {
    await page.goto('https://qa.taltektc.com/index.html');
    await page.getByRole('textbox',{name: 'Email address or Student ID'}).fill('tempdata');
    await page.getByRole('textbox',{name:'Password'}).fill('tempdata');
    await page.getByRole('button',{name:'Log In'}).click();

    // await expect(page.getByText('Invalid student ID')).toBeVisible();
    // await expect(page.getByRole('paragraph')).toContainText('Invalid student ID');

    // xpath
    // tag[@attri="value"]
    
    await expect(page.locator('//p[@id="error-msg"]')).toBeVisible();
})