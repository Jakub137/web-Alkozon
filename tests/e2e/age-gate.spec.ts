import { test, expect } from '@playwright/test';

test.describe('Age Gate Restrictions', () => {
  test('powinien zablokować dodanie zamówienia własnego dla osoby niepełnoletniej', async ({ page }) => {
    await page.goto('/custom-order');

    const underageBtn = page.getByRole('button', { name: 'Nie mam 18 lat' });
    await underageBtn.waitFor({ state: 'visible', timeout: 5000 });
    await underageBtn.click();

    await page.getByRole('button', { name: 'Dalej' }).click();
    await page.getByRole('button', { name: 'Dalej' }).click();
    await page.getByPlaceholder('Np. Dymna Rezerwa Jakuba').fill('E2E Underage');

    const addToCartBtn = page.getByRole('button', { name: 'Dodaj do koszyka' });
    await expect(addToCartBtn).toBeDisabled();
    await expect(
      page.getByText('Opcja składania zamówień na produkty alkoholowe jest dla Ciebie wyłączona')
    ).toBeVisible();

    await page.goto('/cart');
    await expect(page.getByText('Ograniczenie wiekowe')).toBeVisible();
    await expect(page.getByText('Ta część strony zawiera ofertę produktów alkoholowych')).toBeVisible();
  });

  test('powinien zapamiętać status wieku po odświeżeniu strony', async ({ page }) => {
    await page.goto('/custom-order');

    const underageBtn = page.getByRole('button', { name: 'Nie mam 18 lat' });
    await underageBtn.waitFor({ state: 'visible', timeout: 5000 });
    await underageBtn.click();

    await page.reload();

    await page.getByRole('button', { name: 'Dalej' }).click();
    await page.getByRole('button', { name: 'Dalej' }).click();
    await page.getByPlaceholder('Np. Dymna Rezerwa Jakuba').fill('E2E Underage Reload');

    const addToCartBtn = page.getByRole('button', { name: 'Dodaj do koszyka' });
    await expect(addToCartBtn).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Nie mam 18 lat' })).toHaveCount(0);
  });
});
