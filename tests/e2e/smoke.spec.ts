import { test, expect } from "@playwright/test";

// Public flows that don't need auth — run with: E2E_BASE_URL=<url> npx playwright test
test("login page shows the brand and form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "De Huyskamer" })).toBeVisible();
  await expect(page.getByRole("button", { name: /inloglink|login link|login-link/i })).toBeVisible();
});

test("privacy page renders", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /privacy/i })).toBeVisible();
});

test("unauthenticated admin redirects to login with next", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin/);
});
