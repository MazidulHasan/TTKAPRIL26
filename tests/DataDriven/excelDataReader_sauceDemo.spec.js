import {test, expect} from '@playwright/test';
const path = require('path');
const XLSX = require('xlsx');

// Pre processin from excel to json
const excelFile = path.join(__dirname, '../../Data/testData_Multilogin.xlsx');
const workBook = XLSX.readFile(excelFile);
const workSheet = workBook.Sheets[workBook.SheetNames[0]];
const testDatas = XLSX.utils.sheet_to_json(workSheet);

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