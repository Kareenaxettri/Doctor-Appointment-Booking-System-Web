import { test, expect } from "@playwright/test";

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("renders the registration form with all fields", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
    await expect(page.getByPlaceholder("Your full name")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("98XXXXXXXX")).toBeVisible();
    await expect(page.getByPlaceholder("Create a password")).toBeVisible();
    await expect(page.getByPlaceholder("Repeat your password")).toBeVisible();
    await expect(page.getByRole("checkbox")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  });

  test("shows link to login page", async ({ page }) => {
    await expect(page.getByText("Already have an account?")).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
  });

  test("shows validation errors for empty form submission", async ({ page }) => {
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Full name is required")).toBeVisible();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    const emailInput = page.getByPlaceholder("you@example.com");
    await emailInput.fill("not-an-email");
    await emailInput.evaluate((el: HTMLInputElement) => el.removeAttribute("type"));
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
  });

  test("shows validation error for short password", async ({ page }) => {
    await page.getByPlaceholder("Create a password").fill("12345");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
  });

  test("shows error when terms checkbox is not checked", async ({ page }) => {
    await page.getByPlaceholder("Your full name").fill("John Doe");
    await page.getByPlaceholder("you@example.com").fill("john@test.com");
    await page.getByPlaceholder("98XXXXXXXX").fill("9841234567");
    await page.locator("select").selectOption("male");
    await page.getByPlaceholder("Create a password").fill("Password1");
    await page.getByPlaceholder("Repeat your password").fill("Password1");

    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("You must agree to the terms and conditions")).toBeVisible();
  });

  test("gender select has all options", async ({ page }) => {
    const select = page.locator("select");
    await expect(select.locator("option")).toHaveCount(4);
  });
});