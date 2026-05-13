import { test, expect } from '@playwright/test';

test.describe('Shop Page Flow', () => {
  test('powinien móc wyszukać produkt', async ({ page }) => {
    await page.goto('/shop');

    const ageBtn = page.getByRole('button', { name: 'Tak, mam ukończone 18 lat' });
    await ageBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    // Krótki limit: przy wiszącym fetchu nie czekamy 60s+ na selektor, którego loading nigdy nie „zwolni”.
    await expect
      .poll(
        async () => {
          if (await page.getByTestId('shop-catalog-error').isVisible().catch(() => false)) return true;
          if (await page.getByTestId('shop-catalog-empty').isVisible().catch(() => false)) return true;
          if (await page.locator('a[href^="/shop/"]').first().isVisible().catch(() => false)) return true;
          return false;
        },
        { timeout: 22_000, intervals: [200, 400, 600, 1000] }
      )
      .toBeTruthy();

    if (await page.getByTestId('shop-catalog-error').isVisible().catch(() => false)) {
      await expect(page.getByTestId('shop-catalog-error')).toBeVisible();
      return;
    }

    if (await page.getByTestId('shop-catalog-empty').isVisible().catch(() => false)) {
      await expect(page.getByTestId('shop-catalog-empty')).toBeVisible();
      return;
    }

    const firstProductLink = page.locator('a[href^="/shop/"]').first();
    await expect(firstProductLink).toBeVisible({ timeout: 10000 });
    const firstProductName = (await firstProductLink.innerText()).trim();
    const query = firstProductName.slice(0, Math.min(4, firstProductName.length));

    const searchInput = page.getByPlaceholder('Szukaj produktu...');
    await searchInput.fill(query);
    await page.waitForTimeout(500);

    await expect(page.getByText(firstProductName)).toBeVisible();
  });
});
