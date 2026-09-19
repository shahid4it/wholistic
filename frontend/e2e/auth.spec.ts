import { test, expect } from "@playwright/test";
import { login, PASSWORD, signup, STRAPI_URL, uniqueEmail } from "./helpers";

test.describe("Signup", () => {
  test("TC-15 valid signup redirects home", async ({ page }) => {
    await signup(page);
    await expect(page).toHaveURL(/\/$/);
    expect((await page.context().cookies()).some((c) => c.name === "auth")).toBe(true);
  });

  test("TC-16 [BUG-08] mismatched passwords are rejected", async ({ page }) => {
    await signup(page, { repassword: "different" });
    await expect(page).toHaveURL(/\/auth\/signup/);
    await expect(page.locator(".error-message").filter({ hasText: /\S/ })).not.toHaveCount(0);
  });

  test("TC-17 [BUG-08] empty password shows an inline error, not a 500", async ({ page }) => {
    await signup(page, { password: "", repassword: "" });
    await expect(page).toHaveURL(/\/auth\/signup/);
    await expect(page.locator("body")).not.toContainText(/application error|internal server error/i);
    await expect(page.locator(".error-message").filter({ hasText: /\S/ })).not.toHaveCount(0);
  });

  test("TC-18 existing email shows a friendly error", async ({ page, context }) => {
    const email = await signup(page);
    await expect(page).toHaveURL(/\/$/);
    await context.clearCookies();
    await signup(page, { email });
    await expect(page).toHaveURL(/\/auth\/signup/);
    await expect(page.locator("form.signup p").first()).not.toBeEmpty();
  });
});

test.describe("Login and logout", () => {
  test("TC-19 [BUG-01] header shows the logged-in user, not another", async ({ page, context }) => {
    // create an earlier subscriber so "first row" differs from our user
    await signup(page, { firstName: "Earlier" });
    await context.clearCookies();
    const email = uniqueEmail("me");
    await signup(page, { firstName: "Mine", email });
    await context.clearCookies();
    await login(page, email, PASSWORD);
    await expect(page).toHaveURL(/\/$/);
    const header = page.locator("header.header");
    await expect(header).toContainText(/Mine/);
    await expect(header).not.toContainText(/Earlier/);
  });

  test("TC-45 [BUG-27] user with a + in the email can log in", async ({ page, context }) => {
    const email = `qa+tag${Date.now()}@example.com`;
    await signup(page, { email });
    await expect(page).toHaveURL(/\/$/);
    await context.clearCookies();
    await login(page, email, PASSWORD);
    await expect(page).toHaveURL(/\/$/);
  });

  test("TC-20 [BUG-10] wrong password and unknown email give the same error", async ({ page, context }) => {
    const email = await signup(page);
    await context.clearCookies();

    await login(page, email, "wrong-password");
    const wrongPass = (await page.locator("form.login, form.signup").innerText()).trim();

    await login(page, uniqueEmail("ghost"), "wrong-password");
    const unknown = (await page.locator("form.login, form.signup").innerText()).trim();

    expect(wrongPass).toEqual(unknown);
  });

  test("TC-21 [BUG-10] password-less newsletter subscriber gets a graceful error", async ({ page, request }) => {
    const email = uniqueEmail("nopw");
    await request.post("/api/subscribe", { data: { fullName: "No Pass", email } });
    await login(page, email, "anything");
    await expect(page.locator("body")).not.toContainText(/application error|internal server error/i);
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("TC-22 [BUG-04] auth cookie is hardened", async ({ page }) => {
    await signup(page);
    await expect(page).toHaveURL(/\/$/);
    const auth = (await page.context().cookies()).find((c) => c.name === "auth");
    expect(auth).toBeDefined();
    expect(auth!.httpOnly).toBe(true);
    expect(auth!.sameSite).not.toBe("None");
    expect(auth!.expires).toBeGreaterThan(0); // not a session-forever token
  });

  test("TC-23 logout clears the cookie", async ({ page }) => {
    await signup(page);
    await expect(page).toHaveURL(/\/$/);
    const res = await page.request.post("/auth/logout", { maxRedirects: 0 });
    expect(res.status()).toBe(303);
    expect((await page.context().cookies()).some((c) => c.name === "auth")).toBe(false);
  });

  test("TC-24 [BUG-04] logout must not be triggerable via GET", async ({ request }) => {
    const res = await request.get("/auth/logout", { maxRedirects: 0 });
    expect([405, 404]).toContain(res.status());
  });
});

test.describe("API exposure", () => {
  test("TC-25 [BUG-02] subscribers API never returns password", async ({ request }) => {
    const token = process.env.STRAPI_SUBSCRIBE_TOKEN;
    test.skip(!token, "set STRAPI_SUBSCRIBE_TOKEN to run this test");
    const res = await request.get(`${STRAPI_URL}/api/subscribers?pagination[pageSize]=5`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    for (const row of body.data ?? []) {
      expect(row).not.toHaveProperty("password");
    }
  });
});
