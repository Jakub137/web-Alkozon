import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('powinien pokazać błąd logowania dla nieprawidłowych danych', async ({ page }) => {
    await page.route('**/api/auth/guest', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'guest-token',
          refreshToken: 'guest-refresh',
          tokenType: 'Bearer',
          expiresInSeconds: 900,
        }),
      });
    });
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 401,
          error: 'Unauthorized',
          message: 'Invalid credentials',
          path: '/api/auth/login',
          fieldErrors: [],
        }),
      });
    });

    await page.goto('/login');

    const ageBtn = page.getByRole('button', { name: 'Tak, mam ukończone 18 lat' });
    await ageBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    await page.getByPlaceholder('test@test.pl').fill('nie-ma-takiego@example.com');
    await page.getByPlaceholder('••••••••').fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();

    await expect(page).toHaveURL('/login');
    const loginError = page.getByTestId('login-error-banner');
    await expect(loginError).toBeVisible({ timeout: 8_000 });
  });
});
