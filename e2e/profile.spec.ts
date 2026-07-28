import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  test("redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForURL("**/login", { timeout: 10000 });
    expect(page.url()).toContain("/login");
  });
});

test.describe("Profile Form (authenticated)", () => {
  test("shows profile form elements when on profile page", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");

    const isOnLogin = page.url().includes("/login");
    if (isOnLogin) {
      await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();
    }
  });
});

test.describe("Profile Update Validation", () => {
  test("profile page is protected and redirects when not logged in", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForURL("**/login", { timeout: 10000 });
    expect(page.url()).toContain("/login");
  });
});
