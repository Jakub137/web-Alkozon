import { test, expect } from '@playwright/test';

test.describe('Home Page Flow', () => {
  test('powinien wyrenderować główną stronę i kafelki nawigacyjne', async ({ page }) => {
    // 1. Otwarcie strony
    await page.goto('/');
    
    const ageBtn = page.getByRole('button', { name: 'Tak, mam ukończone 18 lat' });
    await ageBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    // 2. Sprawdzanie głównego nagłówka
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // 3. Sprawdzanie czy istnieją linki kafelków
    const shopLink = page.getByRole('link', { name: 'Sklep' }).first();
    await expect(shopLink).toBeVisible();
    
    const cartLink = page.getByRole('link', { name: 'Koszyk' }).first();
    await expect(cartLink).toBeVisible();

    // 4. Kliknięcie na sklep powinno przekierować poprawnie
    await shopLink.click();
    await expect(page).toHaveURL(/.*\/shop/);
  });
});
