import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://qa.taltektc.com/index.html');
  await page.getByRole('textbox', { name: 'Email address or Student ID' }).click();
  await page.getByRole('textbox', { name: 'Email address or Student ID' }).fill('test1212@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('test1212');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.getByRole('link', { name: 'Home (current)' })).toBeVisible();
});