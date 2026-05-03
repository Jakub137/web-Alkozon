# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> E2E: Podstawowy scenariusz aplikacji >> powinien wejść na stronę główną, przejść Age Gate i sprawdzić produkty
- Location: web-Alkozon/tests/e2e/home.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /Dodaj do koszyka/i }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /Dodaj do koszyka/i }).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - img "Alkozon Logo" [ref=e4]
      - text: Alkozon
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img "PL" [ref=e7] [cursor=pointer]
        - img "EN" [ref=e8] [cursor=pointer]
      - button "Tryb jasny" [ref=e9]
      - link "Zaloguj się" [ref=e10] [cursor=pointer]:
        - /url: /login
  - main [ref=e11]:
    - generic [ref=e12]:
      - heading "Odkryj świat najlepszych alkoholi" [level=1] [ref=e13]
      - paragraph [ref=e14]: Zamawiaj ulubione trunki z dostawą, poznawaj ich historię i stwórz własne, niestandardowe zamówienie prosto z naszej destylarni.
      - generic [ref=e15]:
        - link "🍷 Sklep / Katalog Przeglądaj i zamawiaj gotowe trunki" [ref=e16] [cursor=pointer]:
          - /url: /shop
          - generic [ref=e17]: 🍷
          - heading "Sklep / Katalog" [level=2] [ref=e18]
          - paragraph [ref=e19]: Przeglądaj i zamawiaj gotowe trunki
        - link "🛒 Koszyk Twój aktualny koszyk" [ref=e20] [cursor=pointer]:
          - /url: /cart
          - generic [ref=e21]: 🛒
          - heading "Koszyk" [level=2] [ref=e22]
          - paragraph [ref=e23]: Twój aktualny koszyk
        - link "🚚 Status zamówienia Sprawdź gdzie jest Twoja paczka" [ref=e24] [cursor=pointer]:
          - /url: /order-status
          - generic [ref=e25]: 🚚
          - heading "Status zamówienia" [level=2] [ref=e26]
          - paragraph [ref=e27]: Sprawdź gdzie jest Twoja paczka
        - link "📚 Historia alkoholi Poznaj gatunki i tradycje" [ref=e28] [cursor=pointer]:
          - /url: /history
          - generic [ref=e29]: 📚
          - heading "Historia alkoholi" [level=2] [ref=e30]
          - paragraph [ref=e31]: Poznaj gatunki i tradycje
        - link "🧪 Zamówienie własne Skomponuj własny trunek" [ref=e32] [cursor=pointer]:
          - /url: /custom-order
          - generic [ref=e33]: 🧪
          - heading "Zamówienie własne" [level=2] [ref=e34]
          - paragraph [ref=e35]: Skomponuj własny trunek
        - link "❓ FAQ Najczęściej zadawane pytania" [ref=e36] [cursor=pointer]:
          - /url: /faq
          - generic [ref=e37]: ❓
          - heading "FAQ" [level=2] [ref=e38]
          - paragraph [ref=e39]: Najczęściej zadawane pytania
  - button "Open Next.js Dev Tools" [ref=e45] [cursor=pointer]:
    - img [ref=e46]
  - alert [ref=e49]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('E2E: Podstawowy scenariusz aplikacji', () => {
  4  |   test('powinien wejść na stronę główną, przejść Age Gate i sprawdzić produkty', async ({ page }) => {
  5  |     // Krok 1: Wejście na stronę
  6  |     await page.goto('/');
  7  | 
  8  |     // Krok 2: Age Gate (Modal weryfikacji wieku)
  9  |     // Czekamy aż pojawi się modal
  10 |     const ageModalText = page.getByText(/Czy masz ukończone 18 lat\?/i);
  11 |     await expect(ageModalText).toBeVisible({ timeout: 10000 });
  12 | 
  13 |     // Klikamy "Tak, mam ukończone 18 lat"
  14 |     await page.getByText(/Tak, mam ukończone 18 lat/i).click();
  15 | 
  16 |     // Sprawdzamy, czy modal zniknął
  17 |     await expect(ageModalText).not.toBeVisible();
  18 | 
  19 |     // Krok 3: Sprawdzenie nagłówka strony
  20 |     await expect(page.locator('h1').first()).toBeVisible();
  21 | 
  22 |     // Krok 4: Sprawdzenie dostępności kafelka produktu
  23 |     // Powinien tam być tekst ceny lub ikonka koszyka
  24 |     const addToCartButton = page.getByRole('button', { name: /Dodaj do koszyka/i }).first();
> 25 |     await expect(addToCartButton).toBeVisible();
     |                                   ^ Error: expect(locator).toBeVisible() failed
  26 |   });
  27 | });
  28 | 
```