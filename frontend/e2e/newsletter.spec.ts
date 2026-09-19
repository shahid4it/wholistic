import { test, expect } from "@playwright/test";
import { uniqueEmail } from "./helpers";

async function subscribe(page, fullName: string, email: string) {
  const form = page.locator("form.subscribe-form").first();
  await form.scrollIntoViewIfNeeded();
  await form.getByPlaceholder("Enter your name").fill(fullName);
  await form.getByPlaceholder("Enter your email address").fill(email);
  await form.getByRole("button", { name: /sign up/i }).click();
  return form;
}

test.describe("Newsletter", () => {
  test("TC-10 valid subscription succeeds and clears fields", async ({ page }) => {
    await page.goto("/");
    const form = await subscribe(page, "Qa Tester", uniqueEmail("news"));
    await expect(form.locator(".form-message")).toContainText(/subscribed/i);
    await expect(form.getByPlaceholder("Enter your name")).toHaveValue("");
  });

  test("TC-11 [BUG-13] duplicate email shows a friendly message", async ({ page }) => {
    const email = uniqueEmail("dup");
    await page.goto("/");
    await subscribe(page, "Qa Tester", email);
    await expect(page.locator(".form-message").first()).toContainText(/subscribed/i);
    const form = await subscribe(page, "Qa Tester", email);
    const msg = form.locator(".form-message");
    await expect(msg).toBeVisible();
    await expect(msg).not.toContainText(/must be unique|ValidationError/i);
  });

  test("TC-12 [BUG-12] single-word name works", async ({ page }) => {
    await page.goto("/");
    const form = await subscribe(page, "Madonna", uniqueEmail("mono"));
    await expect(form.locator(".form-message")).toContainText(/subscribed/i);
  });

  test("TC-13 [BUG-12] invalid JSON gives 4xx, not 500", async ({ request }) => {
    const res = await request.post("/api/subscribe", {
      headers: { "content-type": "application/json" },
      data: "{not json",
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test("TC-13b [BUG-12] missing fullName gives 4xx, not 500", async ({ request }) => {
    const res = await request.post("/api/subscribe", { data: { email: uniqueEmail() } });
    expect(res.status()).toBeLessThan(500);
  });

  test("HTML5 validation blocks an invalid email", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("form.subscribe-form").first();
    await form.getByPlaceholder("Enter your name").fill("Qa");
    await form.getByPlaceholder("Enter your email address").fill("not-an-email");
    await form.getByRole("button", { name: /sign up/i }).click();
    await expect(form.locator(".form-message")).toHaveCount(0);
  });
});
