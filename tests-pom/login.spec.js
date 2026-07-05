import { test, expect } from '../fixtures/testFixtures';

// These tests exercise sign-in itself, so start from a clean (signed-out)
// session rather than reusing the shared authenticated storage state.
test.use({ storageState: { cookies: [], origins: [] } });

test('valid login lands on home', async ({ loginPage, homePage }) => {
  await loginPage.openAndLogin();
  await homePage.expectLoaded();
});

test('invalid login shows an error', async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.login('tempdata', 'tempdata');
  // await loginPage.expectInvalidLogin('Invalid student ID');
  // await expect(..)
});
