import { test, expect} from '@playwright/test';
const testDatas = JSON.parse( JSON.stringify(require("../../Data/testData_freelance.json")));


console.log('testDatas', testDatas);


test.describe("Multiple test in a single test block", () =>{
    for (const testData of testDatas) {    
        const data = Object.values(testData)[0];
        console.log("data:",data);
        

        test(`Signup Test - ${data.Interests}`, async ({ page }) => {
            await page.goto('https://freelance-learn-automation.vercel.app/signup');

            const interest1 = data.Interests;

            console.log('interest1:',interest1);
            

            await page.locator(`.interest:has-text("${interest1}")`).click();
        })
    }
})


