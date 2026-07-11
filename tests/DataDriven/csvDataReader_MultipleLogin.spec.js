import { test, expect } from '@playwright/test';
const fs = require('fs');
const path = require('path');

const csvFile = path.join(__dirname, '../../Data/testData_MultiLogin.csv');
const csvData = fs.readFileSync(csvFile, 'utf-8').trim().split('\n');
const headers = csvData[0].split(',');

const testData = csvData.slice(1).map((row) => {
    const values = row.split(',');
    return headers.reduce((data, header, index) => {
        data[header.trim()] = values[index].trim();
        return data;
    }, {});
});

console.log("testData:" , testData);


test.describe("CSV Data Driven test", () => {
    for (const data of testData) {
        test(`CSV Data Reader for ${data.userName}`, async ({ page }) => {
            await page.goto('https://www.saucedemo.com/');
            await page.getByRole("textbox", { name: "Username" }).fill(data.userName);
            await page.getByRole("textbox", { name: "Password" }).fill(data.password);
            await page.getByRole("button", { name: "Login" }).click();

            if (data.testStatus === "pass") {
                await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
            } else {
                await expect(page.locator('[data-test="error"]')).toBeVisible();
            }
        });
    }
});
