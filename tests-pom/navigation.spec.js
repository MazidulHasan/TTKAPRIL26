import { test, expect } from '../fixtures/testFixtures';

// Exercises the real home-page navigation bar. Because that nav is rendered
// only after a successful `api/user_info.php` call (which needs a *fresh*
// access token), this test starts from a clean session and performs a live
// UI login via the `loggedInHome` fixture, guaranteeing a valid token.
test.use({ storageState: { cookies: [], origins: [] } });

test('navigate from home to drop down and select a car', async ({ loggedInHome, dropDownPage }) => {
  await loggedInHome.openDropDown();
  await dropDownPage.expectUrl(dropDownPage.config.urls.dropDown);

  await dropDownPage.selectCar('BMW');
  await dropDownPage.expectSelectedLabel('BMW');
  await dropDownPage.selectCar('Audi');
  await dropDownPage.expectSelectedLabel('Audi');
});
