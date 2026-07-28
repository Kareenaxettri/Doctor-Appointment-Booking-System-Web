import { test, expect } from "@playwright/test";
import { setAuthCookies, clearAuthCookies } from "./helpers";

test.describe("Navigation", () => {
  test("logged-out visitors see the landing page at root", async ({ page, context }) => {
    await clearAuthCookies(context);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(page.url().endsWith("/")).toBeTruthy();
    await expect(page.getByRole("link", { name: "Find a doctor" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Log in" }).first()).toBeVisible();
  });

  test("logged-in users are redirected away from the landing page", async ({ page, context }) => {
    await setAuthCookies(context);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const url = page.url();
    const isOnAppPage = url.includes("/dashboard") || url.includes("/admin");
    expect(isOnAppPage).toBeTruthy();
  });

  test("sidebar navigation has correct links", async ({ context, page }) => {
    await setAuthCookies(context);
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("link", { name: "Find Doctors" })).toHaveAttribute("href", "/dashboard");
    await expect(page.getByRole("link", { name: "My Appointments" })).toHaveAttribute("href", "/appointments");
    await expect(page.getByRole("link", { name: "Favorites" })).toHaveAttribute("href", "/favourites");
    await expect(page.getByRole("link", { name: "Payments" })).toHaveAttribute("href", "/payments");
    await expect(page.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/profile");
    await expect(page.getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/settings");
  });

  test("sidebar shows active link for current page", async ({ context, page }) => {
    await setAuthCookies(context);
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const activeLink = page.getByRole("link", { name: "Find Doctors" });
    await expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  test("mobile menu toggle works", async ({ context, page }) => {
    await setAuthCookies(context);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const menuButton = page.getByRole("button", { name: "Toggle menu" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await page.waitForTimeout(300);

    const mobileLogout = page.locator(".fixed button:has-text('Logout')");
    await expect(mobileLogout).toBeVisible();
  });

  test("mobile sidebar closes when a nav link is clicked", async ({ context, page }) => {
    await setAuthCookies(context);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const menuButton = page.getByRole("button", { name: "Toggle menu" });
    await menuButton.click();
    await page.waitForTimeout(300);

    const mobileNav = page.locator(".fixed a:has-text('My Appointments')");
    await mobileNav.click();
    await page.waitForTimeout(500);

    const overlay = page.locator(".fixed.inset-0");
    const isOverlayVisible = await overlay.isVisible().catch(() => false);
    expect(isOverlayVisible).toBeFalsy();
  });

});

test.describe("Protected Routes", () => {
  const protectedRoutes = [
    "/dashboard",
    "/appointments",
    "/payments",
    "/profile",
    "/settings",
    "/favourites",
  ];

  for (const route of protectedRoutes) {
    test(`${route} redirects to login when not authenticated`, async ({ page, context }) => {
      await clearAuthCookies(context);
      await page.goto(route);
      await page.waitForURL("**/login", { timeout: 10000 });
      expect(page.url()).toContain("/login");
    });
  }
});