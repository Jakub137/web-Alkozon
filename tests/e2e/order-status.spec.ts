import { test, expect } from '@playwright/test';

test.describe('Order Status Flow', () => {
  test('powinien znaleźć zamówienie po poprawnych danych', async ({ page }) => {
    await page.goto('/order-status');

    const ageBtn = page.getByRole('button', { name: 'Tak, mam ukończone 18 lat' });
    await ageBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    await page.getByPlaceholder('Np. ALK-2026-0002').fill('ALK-2026-0002');
    await page.getByPlaceholder('Np. anna@example.com').fill('anna@example.com');
    await page.getByRole('button', { name: 'Sprawdź status' }).click();

    await expect(page.getByRole('heading', { name: 'Szczegóły zamówienia' })).toBeVisible();
    await expect(page.getByText('ALK-2026-0002')).toBeVisible();
    await expect(page.getByText('Śledzenie:')).toBeVisible();
  });

  test('powinien pokazać komunikat błędu dla niepoprawnych danych', async ({ page }) => {
    await page.goto('/order-status');

    const ageBtn = page.getByRole('button', { name: 'Tak, mam ukończone 18 lat' });
    await ageBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    await page.getByPlaceholder('Np. ALK-2026-0002').fill('ALK-2026-9999');
    await page.getByPlaceholder('Np. anna@example.com').fill('nobody@example.com');
    await page.getByRole('button', { name: 'Sprawdź status' }).click();

    await expect(
      page.getByText('Nie znaleziono zamówienia dla podanego numeru i e-maila. Sprawdź dane i spróbuj ponownie.')
    ).toBeVisible();
  });
});
