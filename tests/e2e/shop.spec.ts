import { test, expect } from "@playwright/test";

test.describe("Shop Page Flow", () => {
  test("powinien móc wyszukać produkt", async ({ page }) => {
    const mockedProducts = [
      {
        id: 101,
        name: "Vodka Test Premium",
        description: "Mocked product for e2e",
        category: "vodka",
        price: 129.99,
        volumeMl: 700,
        abv: 40,
        imageUrl: "/placeholder-product.svg",
        active: true,
        stockQuantity: 12,
      },
    ];

    await page.route("**/api/auth/guest", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          accessToken: "guest-token",
          refreshToken: "guest-refresh",
          tokenType: "Bearer",
          expiresInSeconds: 900,
        }),
      });
    });
    await page.route("**/api/products**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          content: mockedProducts,
          totalElements: mockedProducts.length,
          totalPages: 1,
          size: 8,
          number: 0,
        }),
      });
    });

    await page.goto("/shop");

    const ageBtn = page.getByRole("button", { name: "Tak, mam ukończone 18 lat" });
    await ageBtn.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    const firstProductName = mockedProducts[0].name;
    await expect(page.getByText(firstProductName, { exact: true })).toBeVisible({ timeout: 8_000 });
    const query = firstProductName.slice(0, Math.min(4, firstProductName.length));

    const searchInput = page.getByPlaceholder("Szukaj produktu...");
    await searchInput.fill(query);
    await page.waitForTimeout(500);

    await expect(page.getByText(firstProductName, { exact: true })).toBeVisible();
  });
});
