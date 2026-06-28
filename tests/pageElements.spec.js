import {test, expect} from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://qa.taltektc.com/index.html');
    await page.getByRole('textbox',{name: 'Email address or Student ID'}).fill('test1212@gmail.com');
    await page.getByRole('textbox',{name:'Password'}).fill('test1212');
    await page.getByRole('button',{name:'Log In'}).click();
})

test('Verifying alert functionality', async ({ page }) => {
    await page.locator('//a[@href="alert.html"]').click();
    page.once('dialog', dialog =>{
        console.log(`Dialog message:${dialog.message()}`);
        dialog.dismiss().catch(() =>{});
    })
    await page.getByRole('button', {name:'Try it'}).click();
    await page.getByRole('button', {name:'Open Small Modal'}).click();
    await page.getByRole('dialog', {name:'Small Modal'}).getByText('Close').click();
})


test('Verifying iframe functionality', async ({ page }) => {
    await page.locator('//a[@href="iframe.html"]').click();
    const talentTekiframe =  page.locator('//iframe[@title="TALENT TEK"]').contentFrame();
    await talentTekiframe.getByRole('button', {name:'Play video'}).click();
    await page.waitForTimeout(3000); // 3 sec
    await talentTekiframe.getByRole('button', {name:'Pause video'}).click();
})

test('Verifying Drag and Drop functionality', async ({ page }) => {
    await page.locator('//a[@href="drag-drop.html"]').click();
    const dragElement = page.locator('#drag1');
    const targetDiv = page.locator('#div2');
    await dragElement.dragTo(targetDiv);
    await expect(targetDiv.locator('#drag1')).toBeVisible();
})

test('Verifying slider functionality', async ({ page }) => {
    await page.locator('//a[@href="slider.html"]').click();
    await page.getByRole('slider').first().fill('100');
    await page.locator('#myRange').fill('100');
})

test('Verifying window functionality', async ({ page }) => {
    await page.locator('//a[@href="switching-windows.html"]').click();

    // new tab
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('button', {name:'New Tab'}).click();
    const page1 = await page1Promise;
    await expect(page1.getByRole('heading', {name:'This is a new tab'})).toBeVisible();


    // new window
    const page2Promise = page.waitForEvent('popup');
    await page.getByRole('button', {name:'New Window'}).click();
    const page2 = await page2Promise;
    await page2.locator('body').click();

    await page1.close();
    await page2.close();
})


test('Verifying right click functionality', async ({ page }) => {
    await page.locator('//a[@href="right-click-action.html"]').click();

    await page.getByRole('button', {name:'Right click me'}).click({
        button:'right'
    });
})


test('Verifying Scroll functionality', async ({ page }) => {
    await page.locator('//a[@href="scrolling-up-down.html"]').click();

    const scrollBox = page.locator('.scrollable-box');
    await scrollBox.hover();

    for (let index = 0; index < 50; index++) {
        await page.mouse.wheel(0, 20);
        await page.waitForTimeout(20);
    }
})

test('Verifying web table functionality', async ({ page }) => {
    await page.locator('//a[@href="users-table.html"]').click();
    await expect(page.getByRole('cell', {name:'user1212@gmail.com'})).toBeVisible();
})