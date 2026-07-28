import { test, expect } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("My Appointments Page", () => {
  test.beforeEach(async ({ context, page }) => {
    await setAuthCookies(context);
  });

  test("shows the page heading", async ({ page }) => {
    await page.goto("/appointments");
    await expect(page.getByRole("heading", { name: "Appointment History" })).toBeVisible();
  });

  test("shows status filter tabs", async ({ page }) => {
    await page.goto("/appointments");
    await expect(page.getByRole("button", { name: /All/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Upcoming/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Completed/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Cancelled/ })).toBeVisible();
  });

  test("shows Book Appointment link", async ({ page }) => {
    await page.goto("/appointments");
    await expect(page.getByRole("link", { name: "+ Book Appointment" })).toHaveAttribute("href", "/dashboard");
  });

  test("can switch between status tabs", async ({ page }) => {
    await page.goto("/appointments");
    await page.getByRole("button", { name: /Upcoming/ }).click();
    await page.getByRole("button", { name: /Completed/ }).click();
    await page.getByRole("button", { name: /Cancelled/ }).click();
    await page.getByRole("button", { name: /All/ }).click();
  });

  test("shows empty state when no appointments exist", async ({ page }) => {
    await page.goto("/appointments");
    await page.waitForSelector("text=/No .*appointments|Loading/", { timeout: 10000 });
    const noAppointments = page.getByText("No all appointments");
    const loading = page.getByText("Loading appointments...");
    const hasEmptyOrLoading = (await noAppointments.isVisible()) || (await loading.isVisible());
    expect(hasEmptyOrLoading).toBeTruthy();
  });
});
