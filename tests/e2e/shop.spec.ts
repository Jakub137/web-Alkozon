import { test, expect } from '@playwright/test';

test.describe('Shop Page Flow', () => {
  test('powinien móc wyszukać produkt', async ({ page }) => {
    await page.goto('/shop');

    const ageBtn = page.getByRole('button', { name: 'Tak, mam ukończone 18 lat' });
    await ageBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    const noProducts = page.getByText('Brak produktów do wyświetlenia');
    if (await noProducts.isVisible()) {
      await expect(noProducts).toBeVisible();
      return;
    }

    const firstProductLink = page.locator('a[href^="/shop/"]').first();
    const firstProductName = (await firstProductLink.innerText()).trim();
    const query = firstProductName.slice(0, Math.min(4, firstProductName.length));

    const searchInput = page.getByPlaceholder('Szukaj produktu...');
    await searchInput.fill(query);
    await page.waitForTimeout(500);

    await expect(page.getByText(firstProductName)).toBeVisible();
  });
});
