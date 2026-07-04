const { test, expect } = require('./../fixtuer');

test('admin can open the drop down page', async ({ adminPage }) => {
    await adminPage.goto('https://qa.taltektc.com/home.html');
    await adminPage.getByRole('link', { name: 'Drop down (current)' }).click();
    // await expect(adminPage).toHaveURL('https://qa.taltektc.com/drop-down.html');
});

test('admin can open the drop down page 2', async ({ adminPage }) => {
    await adminPage.goto('https://qa.taltektc.com/home.html');
    await adminPage.getByRole('link', { name: 'Drop down (current)' }).click();
    // await expect(adminPage).toHaveURL('https://qa.taltektc.com/drop-down.html');
});