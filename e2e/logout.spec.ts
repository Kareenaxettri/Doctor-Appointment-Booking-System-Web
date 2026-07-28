import { test, expect } from "@playwright/test";
import { setAuthCookies, clearAuthCookies } from "./helpers";

test.describe("Logout", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("logout button is visible on the dashboard sidebar", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const logoutBtn = page.getByRole("button", { name: "Logout" });
    await expect(logoutBtn).toBeVisible();
  });

  test("logout redirects to login page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const logoutBtn = page.getByRole("button", { name: "Logout" });
    await logoutBtn.click();
    await page.waitForURL("**/login", { timeout: 10000 });
    expect(page.url()).toContain("/login");
  });

  test("sign out button is visible on admin sidebar", async ({ page, context }) => {
    await clearAuthCookies(context);
    await setAuthCookies(context, {
      id: "admin-001",
      fullName: "Admin User",
      email: "admin@test.com",
      role: "admin",
      profileImage: "",
      contactNumber: "9841234567",
      gender: "male",
    });
    await page.goto("/admin/users");
    await page.waitForLoadState("networkidle");
    const signOut = page.getByRole("button", { name: "Sign out" });
    const logout = page.getByRole("button", { name: "Logout" });
    const hasButton = (await signOut.isVisible()) || (await logout.isVisible());
    expect(hasButton).toBeTruthy();
  });
});
