const { test: base, expect } = require('@playwright/test');
const { loginAndGetContext } = require('./helpers/auth/login');

const test = base.extend({
  adminPage: async ({ browser }, use) => {
    const { page, context } = await loginAndGetContext(browser, 'test1212@gmail.com', 'test1212');
    try {
      await use(page);
    }
    catch(exception){
      console.log(exception);
    }
    finally {
      await context.close();
    }
  }
});
module.exports = { test, expect };