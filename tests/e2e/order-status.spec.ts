import { test, expect } from "@playwright/test";

test.describe("Order Status Flow", () => {
  test("powinien znaleźć zamówienie po poprawnych danych", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("alkozon_age_status", "adult");
    });
    await page.route("**/api/orders/track**", async (route) => {
      const url = new URL(route.request().url());
      const orderId = url.searchParams.get("orderId");
      const email = url.searchParams.get("email");

      if (orderId === "2" && email === "anna@example.com") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            orderId: 2,
            status: "IN_DELIVERY",
            createdAt: "2026-05-10T08:00:00Z",
            updatedAt: "2026-05-10T12:00:00Z",
          }),
        });
        return;
      }

      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ status: 404, message: "Order not found" }),
      });
    });

    await page.goto("/order-status");

    await page.getByLabel("Numer zamówienia").fill("ORD-2");
    await page.getByLabel("E-mail").fill("anna@example.com");
    await page.getByRole("button", { name: "Sprawdź status" }).click();

    await expect(page.getByRole("heading", { name: "Szczegóły zamówienia" })).toBeVisible();
    await expect(page.getByText("ORD-2")).toBeVisible();
  });

  test("powinien pokazać komunikat błędu dla niepoprawnych danych", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("alkozon_age_status", "adult");
    });
    await page.route("**/api/orders/track**", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ status: 404, message: "Order not found" }),
      });
    });

    await page.goto("/order-status");

    await page.getByLabel("Numer zamówienia").fill("ORD-9999");
    await page.getByLabel("E-mail").fill("nobody@example.com");
    await page.getByRole("button", { name: "Sprawdź status" }).click();

    await expect(
      page.getByText(
        "Nie znaleziono zamówienia dla podanego numeru i e-maila. Sprawdź dane i spróbuj ponownie."
      )
    ).toBeVisible();
  });
});
