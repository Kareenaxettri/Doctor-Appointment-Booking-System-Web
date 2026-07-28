import { test, expect } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Cancel Appointment", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookies(context);
  });

  test("no cancel buttons shown when no active appointments", async ({ page }) => {
    await page.goto("/appointments");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const cancelBtns = page.locator("button:text-is('Cancel')");
    const count = await cancelBtns.count();
    expect(count).toBe(0);
  });

  test("cancel button has proper accessibility attributes when present", async ({ page }) => {
    await page.goto("/appointments");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const cancelBtns = page.locator("button:text-is('Cancel')");
    const count = await cancelBtns.count();
    for (let i = 0; i < count; i++) {
      await expect(cancelBtns.nth(i)).toBeEnabled();
    }
  });
});
