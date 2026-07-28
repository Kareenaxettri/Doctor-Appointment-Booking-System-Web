import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders the login form with all fields", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("shows link to register page", async ({ page }) => {
    await expect(page.getByText("Don't have an account?")).toBeVisible();
    await expect(page.getByRole("link", { name: "Create one" })).toHaveAttribute("href", "/register");
  });

  test("shows link to forgot password", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Forgot password?" })).toHaveAttribute("href", "/forgot-password");
  });

  test("shows validation errors for empty form submission", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
    await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    const emailInput = page.getByPlaceholder("you@example.com");
    await emailInput.fill("invalid-email");
    await page.locator("form").evaluate((form: HTMLFormElement) => {
      form.setAttribute("novalidate", "");
    });
    await emailInput.evaluate((el: HTMLInputElement) => el.removeAttribute("type"));
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
  });

  test("shows validation error for short password", async ({ page }) => {
    await page.getByPlaceholder("Enter your password").fill("12345");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
  });

  test("shows success message after password reset", async ({ page }) => {
    await page.goto("/login?reset=success");
    await expect(page.getByText("Your password has been reset successfully")).toBeVisible();
  });

  test("displays loading state when submitting", async ({ page }) => {
    await page.getByPlaceholder("you@example.com").fill("test@test.com");
    await page.getByPlaceholder("Enter your password").fill("Password1");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("button", { name: "Signing in..." })).toBeVisible();
  });
});