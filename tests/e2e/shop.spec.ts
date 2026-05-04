import { test, expect } from '@playwright/test';

test.describe('Shop Page Flow', () => {
  test('powinien móc wyszukać produkt', async ({ page }) => {
    // 1. Otwarcie sklepu
    await page.goto('/shop');

    const ageBtn = page.getByRole('button', { name: 'Tak, mam ukończone 18 lat' });
    await ageBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    // 2. Szukanie w pasku (test działania opóźnienia Debounce)
    const searchInput = page.getByPlaceholder('Szukaj produktu...');
    await searchInput.fill('Dom');
    
    // Odczekanie na hook'a odpowiedzialnego za opóźnienie w szukaniu
    await page.waitForTimeout(500);

    // 3. Sprawdzenie, czy pojawił się dany produkt
    await expect(page.getByText('Dom Pérignon')).toBeVisible();

    // 4. Upewnienie się że produkty, które nie pasują (np. Jack) nie są widoczne
    await expect(page.getByText('Jack Daniel\'s')).not.toBeVisible();
  });
});
