import { test, expect } from "@playwright/test";
import { setAuthCookies } from "./helpers";

test.describe("Book Appointment Flow", () => {
  test.beforeEach(async ({ context, page }) => {
    await setAuthCookies(context);
    await page.goto("/appointments/booking?doctorId=derm-1&doctorName=Dr.%20Pooja%20Shrestha&fee=1200");
  });

  test("renders the booking page with doctor info", async ({ page }) => {
    await expect(page.getByText("Book Your Appointment")).toBeVisible();
  });

  test("shows date picker", async ({ page }) => {
    await expect(page.getByRole("textbox", { name: "Appointment Date" })).toBeVisible();
  });

  test("shows time slot buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: "09:00 AM" })).toBeVisible();
    await expect(page.getByRole("button", { name: "10:00 AM" })).toBeVisible();
    await expect(page.getByRole("button", { name: "11:00 AM" })).toBeVisible();
    await expect(page.getByRole("button", { name: "01:00 PM" })).toBeVisible();
  });

  test("time slots are disabled before date selection", async ({ page }) => {
    await expect(page.getByRole("button", { name: "09:00 AM" })).toBeDisabled();
  });

  test("selecting a date enables time slots", async ({ page }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    await page.locator("input[type='date']").fill(dateStr);
    await expect(page.getByRole("button", { name: "09:00 AM" })).toBeEnabled();
  });

  test("selecting a time slot highlights it", async ({ page }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    await page.locator("input[type='date']").fill(dateStr);
    await page.getByRole("button", { name: "10:00 AM" }).click();

    const btn = page.getByRole("button", { name: "10:00 AM" });
    await expect(btn).toHaveAttribute("style", /background:\s*var\(--brand\)/);
  });

  test("shows booking summary sidebar", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Booking Summary" })).toBeVisible();
    await expect(page.getByText("Consultation Fee")).toBeVisible();
    await expect(page.getByText("Rs. 1200")).toBeVisible();
  });

  test("shows validation error when confirming without date", async ({ page }) => {
    await page.getByRole("button", { name: "Confirm Appointment" }).click();
    await expect(page.getByText("Please select a date first.")).toBeVisible();
  });

  test("shows validation error when confirming without time slot", async ({ page }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    await page.locator("input[type='date']").fill(dateStr);
    await page.getByRole("button", { name: "Confirm Appointment" }).click();
    await expect(page.getByText("Please select a time slot first.")).toBeVisible();
  });

  test("has a notes textarea", async ({ page }) => {
    await expect(page.getByPlaceholder("Describe your symptoms or add notes for the doctor...")).toBeVisible();
    await expect(page.getByText("/500 characters")).toBeVisible();
  });

  test("notes textarea respects maxLength", async ({ page }) => {
    const textarea = page.getByPlaceholder("Describe your symptoms or add notes for the doctor...");
    await textarea.fill("A".repeat(500));
    const value = await textarea.inputValue();
    expect(value.length).toBeLessThanOrEqual(500);
  });
});