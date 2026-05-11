import { test, expect } from '@playwright/test';

test.describe('Cart Flow', () => {
  test('powinien dodać zamówienie własne do koszyka i je usunąć', async ({ page }) => {
    await page.goto('/custom-order');

    const ageBtn = page.getByRole('button', { name: 'Tak, mam ukończone 18 lat' });
    await ageBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    await page.getByRole('button', { name: 'Dalej' }).click();
    await page.getByRole('button', { name: 'Dalej' }).click();
    await page.getByPlaceholder('Np. Dymna Rezerwa Jakuba').fill('E2E Custom');
    await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();

    await page.getByRole('link', { name: 'Przejdź do podsumowania' }).click();

    const removeBtn = page.getByRole('button', { name: 'Usuń' }).first();
    await expect(removeBtn).toBeVisible();

    await removeBtn.click();

    await expect(page.getByText('Koszyk jest pusty')).toBeVisible();
  });
});
