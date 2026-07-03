const { chromium, expect } = require('@playwright/test');


async function globlSetup() {

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://qa.taltektc.com/index.html');
    await page.getByRole('textbox',{name: 'Email address or Student ID'}).fill('test1212@gmail.com');
    await page.getByRole('textbox',{name:'Password'}).fill('test1212');
    await page.getByRole('button',{name:'Log In'}).click();
    await expect(page.locator('//a[@href="drag-drop.html"]')).toBeVisible();

    await page.context().storageState({
        path: 'playwright/.auth/user.json'
    });

    await browser.close();
}

module.exports = globlSetup;
