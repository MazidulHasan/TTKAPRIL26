import { test, expect } from '../fixtures/testFixtures';

// These tests use the shared authenticated storage state (localStorage token
// + session cookie, wired in playwright.config.js) and navigate directly to
// each feature page via its page object's `open()`.
//
// Note: we deliberately do NOT route through home.html's navigation bar. That
// bar is rendered dynamically after a call to `api/user_info.php`, which the
// app rejects once the short-lived access token ages out — making it flaky.
// The feature pages themselves are static and work with the stored session, so
// direct navigation keeps every test independent and reliable.

test('alert and small modal', async ({ alertPage }) => {
  await alertPage.open();
  await alertPage.triggerAlert('dismiss');
  await alertPage.openSmallModal();
  await alertPage.closeSmallModal();
});

test('iframe video play/pause', async ({ iframePage }) => {
  await iframePage.open();
  await iframePage.playVideo();
  await iframePage.page.waitForTimeout(3000);
  await iframePage.pauseVideo();
});

test('drag and drop', async ({ dragDropPage }) => {
  await dragDropPage.open();
  await dragDropPage.dragToTarget();
  await dragDropPage.expectDropped();
});

test('slider', async ({ sliderPage }) => {
  await sliderPage.open();
  await sliderPage.setValue(100);
});

test('switching windows', async ({ windowsPage }) => {
  await windowsPage.open();

  const newTab = await windowsPage.openNewTab();
  await windowsPage.expectNewTabHeading(newTab);

  const newWindow = await windowsPage.openNewWindow();
  await newWindow.locator('body').click();

  await newTab.close();
  await newWindow.close();
});

test('right click', async ({ rightClickPage }) => {
  await rightClickPage.open();
  await rightClickPage.rightClick();
});

test('scroll inside box', async ({ scrollPage }) => {
  await scrollPage.open();
  await scrollPage.scrollBoxBy(50);
});

test('web table shows user', async ({ webTablePage }) => {
  await webTablePage.open();
  await webTablePage.expectUserVisible('user1212@gmail.com');
});
