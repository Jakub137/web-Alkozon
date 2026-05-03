import { test, expect } from '@playwright/test';

test.describe('E2E: Podstawowy scenariusz aplikacji', () => {
  test('powinien wejść na stronę główną, przejść Age Gate i sprawdzić produkty', async ({ page }) => {
    // Krok 1: Wejście na stronę
    await page.goto('/');

    // Krok 2: Age Gate (Modal weryfikacji wieku)
    // Czekamy aż pojawi się modal
    const ageModalText = page.getByText(/Czy masz ukończone 18 lat\?/i);
    await expect(ageModalText).toBeVisible({ timeout: 10000 });

    // Klikamy "Tak, mam ukończone 18 lat"
    await page.getByText(/Tak, mam ukończone 18 lat/i).click();

    // Sprawdzamy, czy modal zniknął
    await expect(ageModalText).not.toBeVisible();

    // Krok 3: Sprawdzenie nagłówka strony
    await expect(page.locator('h1').first()).toBeVisible();

    // Krok 4: Sprawdzenie dostępności kafelka produktu
    // Powinien tam być tekst ceny lub ikonka koszyka
    const addToCartButton = page.getByRole('button', { name: /Dodaj do koszyka/i }).first();
    await expect(addToCartButton).toBeVisible();
  });
});
