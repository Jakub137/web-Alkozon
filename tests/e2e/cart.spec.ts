import { test, expect } from '@playwright/test';

test.describe('Cart Flow', () => {
  test('powinien pomyślnie dodać produkt do koszyka i móc go usunąć', async ({ page }) => {
    // 1. Otwarcie sklepu
    await page.goto('/shop');

    const ageBtn = page.getByRole('button', { name: 'Tak, mam ukończone 18 lat' });
    await ageBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    // 3. Dodanie pierwszego dostępnego produktu do koszyka
    const addToCartBtn = page.getByRole('button', { name: 'Dodaj do koszyka' }).first();
    await addToCartBtn.click();

    // 4. Przejście do koszyka przez przycisk w koszyku podręcznym na dole ekranu
    const cartLink = page.getByRole('link', { name: 'Podsumowanie' }).first();
    await cartLink.click();

    // 5. Sprawdzenie czy w koszyku pojawił się przycisk 'Usuń', co świadczy o obecności produktu
    const removeBtn = page.getByRole('button', { name: 'Usuń' }).first();
    await expect(removeBtn).toBeVisible();

    // 6. Usunięcie produktu z koszyka
    await removeBtn.click();

    // 7. Weryfikacja powrotu do ekranu pustego koszyka
    await expect(page.getByText('Koszyk jest pusty')).toBeVisible();
  });
});
