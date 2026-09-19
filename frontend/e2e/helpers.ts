import { expect, Page } from "@playwright/test";

export const STRAPI_URL = process.env.E2E_STRAPI_URL ?? "http://localhost:1337";

export const uniqueEmail = (prefix = "qa") =>
  `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;

export const PASSWORD = "Str0ng!Passw0rd";

/** Collect uncaught page errors and console errors for later assertions. */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

export async function signup(
  page: Page,
  {
    firstName = "Qa",
    lastName = "Tester",
    email = uniqueEmail(),
    password = PASSWORD,
    repassword = password,
  } = {}
) {
  await page.goto("/auth/signup");
  await page.locator('input[name="firstName"]').fill(firstName);
  await page.locator('input[name="lastName"]').fill(lastName);
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="repassword"]').fill(repassword);
  await page.getByRole("button", { name: "Subscribe" }).click();
  return email;
}

export async function login(page: Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

export async function openBookingModal(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Book a Session" }).first().click();
  await expect(page.locator("#modal-container .reader-list").first()).toBeVisible();
}
