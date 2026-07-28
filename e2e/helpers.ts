import { Page, BrowserContext } from "@playwright/test";

const MOCK_USER = {
  id: "test-user-001",
  fullName: "Test User",
  email: "test@test.com",
  role: "user",
  profileImage: "",
  contactNumber: "9841234567",
  gender: "male",
};

const MOCK_ADMIN = {
  id: "admin-001",
  fullName: "Admin User",
  email: "admin@test.com",
  role: "admin",
  profileImage: "",
  contactNumber: "9841234567",
  gender: "male",
};

export async function setAuthCookies(
  context: BrowserContext,
  user = MOCK_USER
) {
  await context.addCookies([
    {
      name: "auth_token",
      value: "mock-jwt-token-e2e-test",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
    {
      name: "user_data",
      value: JSON.stringify(user),
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}

export async function clearAuthCookies(context: BrowserContext) {
  await context.clearCookies();
}

export async function loginAsUser(page: Page) {
  await setAuthCookies(page.context());
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");
}

export async function loginAsAdmin(page: Page) {
  await setAuthCookies(page.context(), MOCK_ADMIN);
  await page.goto("/admin/users");
  await page.waitForLoadState("networkidle");
}
