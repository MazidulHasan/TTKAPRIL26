const fs = require('fs/promises');
const path = require('path');

const LOGIN_URL = 'https://qa.taltektc.com/index.html';
const HOME_URL = 'https://qa.taltektc.com/home.html';
const STORAGE_STATE_PATH = 'playwright/.auth/user.json';

async function loginAndGetContext(browser, userName, password) {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(LOGIN_URL);
    await page.getByRole('textbox', { name: 'Email address or Student ID' }).fill(userName);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL(HOME_URL);

    await fs.mkdir(path.dirname(STORAGE_STATE_PATH), { recursive: true }); // safty net for ci/cd
    await context.storageState({ path: STORAGE_STATE_PATH });

    return { page, context };
}

module.exports = { loginAndGetContext };