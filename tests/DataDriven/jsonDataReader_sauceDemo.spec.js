import {test, expect} from '@playwright/test';
const testDatas = JSON.parse( JSON.stringify(require("../../Data/testData_saucedemo.json")));


test.describe("Multiple test in a single test block", () =>{
    for (const testData of testDatas) {    
        test(`Json Data Reader for ${testData.userName}`, async ({ page }) => {
            await page.goto('https://www.saucedemo.com/');
            
            await page.locator('#user-name').fill(testData.userName);
            await page.locator('#password').fill(testData.password);
            await page.locator('#login-button').click();

            if (testData.testStatus === 'pass') {
                await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
            } else{
                await expect(page.locator('.error-message-container')).toBeVisible();
            }
        })
    }
})