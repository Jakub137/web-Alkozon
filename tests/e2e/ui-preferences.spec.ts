import { test, expect } from "@playwright/test";

test.describe("UI Preferences", () => {
  test("powinien przełączyć język na angielski", async ({ page }) => {
    await page.goto("/");

    const ageBtn = page.getByRole("button", { name: "Tak, mam ukończone 18 lat" });
    await ageBtn.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    await page.getByAltText("EN").click();

    await expect(
      page.getByRole("heading", { level: 1, name: "Discover the world of premium spirits" })
    ).toBeVisible();
  });

  test("powinien przełączyć i zapamiętać dark mode po odświeżeniu", async ({ page }) => {
    await page.goto("/");

    const ageBtn = page.getByRole("button", { name: "Tak, mam ukończone 18 lat" });
    await ageBtn.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
    if (await ageBtn.isVisible()) await ageBtn.click();

    const themeToggle = page
      .getByRole("button")
      .filter({ hasText: /Tryb|Mode/ })
      .first();
    await themeToggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
