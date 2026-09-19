import { test, expect } from "@playwright/test";
import { trackErrors } from "./helpers";

const ROUTES = [
  "/",
  "/about",
  "/contact",
  "/services",
  "/readers",
  "/testimonials",
  "/resources/video",
];

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

test.describe("Navigation and content", () => {
  test("TC-01 home renders with header and footer, no console errors", async ({ page }) => {
    const errors = trackErrors(page);
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
    await expect(page.locator("header.header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("section.home")).toBeVisible();
    expect(errors, errors.join("\n")).toEqual([]);
  });

  for (const route of ROUTES) {
    test(`TC-02 ${route} loads`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("main, section").first()).toBeVisible();
    });
  }

  test("TC-03 /resources/horoscope redirects to Aries", async ({ page }) => {
    await page.goto("/resources/horoscope");
    await expect(page).toHaveURL(/\/resources\/horoscope\/Aries$/);
  });

  for (const sign of SIGNS) {
    test(`TC-04 horoscope ${sign}`, async ({ page }) => {
      await page.goto(`/resources/horoscope/${sign}`);
      await expect(page.locator(".horoscope-title")).toContainText(sign);
      await expect(page.locator(".horoscope-description")).not.toBeEmpty();
    });
  }

  test("TC-05 [BUG-19] lowercase sign returns the same content", async ({ page }) => {
    await page.goto("/resources/horoscope/Aries");
    const expected = await page.locator(".horoscope-description").innerText();
    await page.goto("/resources/horoscope/aries");
    await expect(page.locator(".horoscope-description")).toHaveText(expected);
  });

  test("TC-06 [BUG-06] unknown reader gives a 404, not a crash", async ({ page }) => {
    const res = await page.goto("/readers/does-not-exist");
    expect(res?.status()).toBe(404);
  });

  test("TC-07 [BUG-06] unknown blog post gives a 404", async ({ page }) => {
    const res = await page.goto("/resources/blog/does-not-exist");
    expect(res?.status()).toBe(404);
  });

  test("TC-08 reader page shows details", async ({ page }) => {
    await page.goto("/readers");
    const link = page.locator('a[href^="/readers/"]').first();
    await link.click();
    await expect(page).toHaveURL(/\/readers\/.+/);
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page.locator(".psychic-single")).toBeVisible();
  });

  test("TC-09 [BUG-06] page survives a Strapi outage", async ({ page }) => {
    await page.route("**/graphql", (route) => route.abort());
    const errors = trackErrors(page);
    const res = await page.goto("/resources/horoscope/Aries");
    expect(res?.status()).toBeLessThan(500);
    expect(errors.filter((e) => /is not iterable|is not a function/.test(e))).toEqual([]);
  });

  test("TC-42 security headers on /", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["content-security-policy"] ?? h["x-frame-options"]).toBeTruthy();
  });

  test("TC-37 [BUG-05] malicious slug is handled safely", async ({ page }) => {
    const res = await page.goto(`/readers/${encodeURIComponent('x" ) { id } #')}`);
    expect(res?.status()).toBe(404);
    await expect(page.locator("body")).not.toContainText(/graphql|syntax error/i);
  });

  for (const [w, h] of [[375, 812], [768, 1024], [1440, 900]]) {
    test(`TC-41 no horizontal scroll at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
