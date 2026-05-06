import { test, expect } from '@playwright/test';

test.describe('Age Gate Restrictions', () => {
  test('powinien zablokować zakup dla osoby niepełnoletniej', async ({ page }) => {
    await page.goto('/shop');

    const underageBtn = page.getByRole('button', { name: 'Nie mam 18 lat' });
    await underageBtn.waitFor({ state: 'visible', timeout: 5000 });
    await underageBtn.click();

    const addToCartBtn = page.getByRole('button', { name: 'Dodaj do koszyka' }).first();
    await expect(addToCartBtn).toBeDisabled();

    await page.goto('/cart');
    await expect(page.getByText('Ograniczenie wiekowe')).toBeVisible();
    await expect(page.getByText('Opcja składania zamówień na produkty alkoholowe jest dla Ciebie wyłączona')).toBeVisible();
  });

  test('powinien zapamiętać status wieku po odświeżeniu strony', async ({ page }) => {
    await page.goto('/shop');

    const underageBtn = page.getByRole('button', { name: 'Nie mam 18 lat' });
    await underageBtn.waitFor({ state: 'visible', timeout: 5000 });
    await underageBtn.click();

    await page.reload();

    const addToCartBtn = page.getByRole('button', { name: 'Dodaj do koszyka' }).first();
    await expect(addToCartBtn).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Nie mam 18 lat' })).toHaveCount(0);
  });
});
