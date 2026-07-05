import { test, expect } from '../fixtures/testFixtures';

// External demo site; no app auth needed.
test.use({ storageState: { cookies: [], origins: [] } });

test('upload a file', async ({ fileUploadPage }) => {
  await fileUploadPage.open();
  await fileUploadPage.uploadFile('ss1.png');
  // Preview id is dynamic on the demo site; assert the file size text instead.
  // The size renders in both the inline preview and a zoom preview, so scope
  // to the first match.
  await expect(fileUploadPage.page.getByText('(167.5 KB)').first()).toBeVisible();
});
