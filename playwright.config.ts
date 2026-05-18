import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 60000, // Zwiększony limit czasu dla wolniejszych komputerów/pierwszej kompilacji Next.js
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Dwie pełne próby × długi waitFor = bardzo długi job na GH; jedna retry wystarczy na chwilową flakiness.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
