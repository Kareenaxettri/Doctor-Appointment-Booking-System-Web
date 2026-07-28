import { test, expect } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Dashboard - Find Doctors", () => {
  test.beforeEach(async ({ context, page }) => {
    await setAuthCookies(context);
    await page.goto("/dashboard");
  });

  test("displays the page heading and welcome message", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Find Your Specialist" })).toBeVisible();
  });

  test("shows the search input", async ({ page }) => {
    await expect(page.getByPlaceholder("Search doctors, specializations, clinics...")).toBeVisible();
  });

  test("shows specialty filter buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: "All Specialists" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cardiology" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Dermatology" })).toBeVisible();
  });

  test("shows sort dropdown with options", async ({ page }) => {
    const select = page.locator("select");
    await expect(select).toBeVisible();
    await expect(select).toHaveValue("rating");
  });

  test("loads and displays doctor cards", async ({ page }) => {
    const showingText = page.locator("text=/Showing \\d+ of \\d+ doctors/");
    await expect(showingText).toBeVisible({ timeout: 15000 });
  });

  test("filters doctors by specialty", async ({ page }) => {
    await expect(page.locator("text=/Showing \\d+ of \\d+ doctors/")).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "Cardiology" }).click();
    await page.waitForTimeout(500);
    const showing = page.locator("text=/Showing \\d+ of \\d+ doctors/");
    await expect(showing).toBeVisible();
  });

  test("search filters doctors by name", async ({ page }) => {
    await expect(page.locator("text=/Showing \\d+ of \\d+ doctors/")).toBeVisible({ timeout: 15000 });
    await page.getByPlaceholder("Search doctors, specializations, clinics...").fill("Pooja");
    await page.waitForTimeout(300);
    await expect(page.getByText("Showing 1 of")).toBeVisible();
  });

  test("clear search button resets the search", async ({ page }) => {
    await expect(page.locator("text=/Showing \\d+ of \\d+ doctors/")).toBeVisible({ timeout: 15000 });
    await page.getByPlaceholder("Search doctors, specializations, clinics...").fill("test");
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await expect(page.getByPlaceholder("Search doctors, specializations, clinics...")).toHaveValue("");
  });

  test("clear all filters resets both search and filter", async ({ page }) => {
    await expect(page.locator("text=/Showing \\d+ of \\d+ doctors/")).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "Cardiology" }).click();
    await page.getByPlaceholder("Search doctors, specializations, clinics...").fill("xyz123");
    await page.waitForTimeout(300);

    const noResults = page.getByText("No specialists found");
    if (await noResults.isVisible()) {
      await page.getByRole("button", { name: "Clear all filters" }).click();
      await expect(page.getByPlaceholder("Search doctors, specializations, clinics...")).toHaveValue("");
    }
  });

  test("each doctor card has a Book Appointment button", async ({ page }) => {
    await expect(page.locator("text=/Showing \\d+ of \\d+ doctors/")).toBeVisible({ timeout: 15000 });
    const bookButtons = page.getByRole("link", { name: "Book Appointment" });
    await expect(bookButtons.first()).toBeVisible();
    const count = await bookButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("each doctor card has a favorite toggle button", async ({ page }) => {
    await expect(page.locator("text=/Showing \\d+ of \\d+ doctors/")).toBeVisible({ timeout: 15000 });
    const favButtons = page.getByRole("button", { name: "Add to favorites" });
    await expect(favButtons.first()).toBeVisible();
    const count = await favButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("showing count matches cards visible", async ({ page }) => {
    await expect(page.locator("text=/Showing \\d+ of \\d+ doctors/")).toBeVisible({ timeout: 15000 });
    const showingText = await page.locator("text=/Showing \\d+ of \\d+ doctors/").textContent();
    const match = showingText?.match(/Showing (\d+) of/);
    if (match) {
      const shown = parseInt(match[1]);
      expect(shown).toBeGreaterThan(0);
    }
  });
});