import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('powinien poprawnie zalogować po podaniu prawidłowych danych i wylogować', async ({ page }) => {
    // 1. Otwarcie logowania
    await page.goto('/login');

    const ageBtn = page.getByRole('button', { name: 'Tak, mam ukończone 18 lat' });
    await ageBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    // 2. Wypełnienie formularza
    await page.getByPlaceholder('test@test.pl').fill('test@test.pl');
    await page.getByPlaceholder('••••••••').fill('Test1234!');
    
    // 3. Kliknięcie "Zaloguj się"
    await page.getByRole('button', { name: 'Zaloguj się' }).click();

    // 4. Po zalogowaniu przekierowuje na stronę główną
    await expect(page).toHaveURL('/');

    // 5. W pasku pojawia się 'Wyloguj' ukryte pod przyciskiem z lucide-react (oparte o title)
    const logoutBtn = page.locator('button[title="Wyloguj"]');
    await expect(logoutBtn).toBeVisible();

    // 6. Poprawne wylogowanie
    await logoutBtn.click();

    // 7. W pasku nawigacji wraca napis 'Zaloguj się'
    const loginLink = page.getByRole('link', { name: 'Zaloguj się' }).first();
    await expect(loginLink).toBeVisible();
  });
});
