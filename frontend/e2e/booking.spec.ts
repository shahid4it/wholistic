import { test, expect } from "@playwright/test";
import { openBookingModal } from "./helpers";

const modal = (page) => page.locator("#modal-container");

async function pickFirstReader(page) {
  await openBookingModal(page);
  await modal(page).getByRole("button", { name: "Book a Session" }).first().click();
  await expect(modal(page).locator("form.form")).toBeVisible();
}

test.describe("Booking", () => {
  test("TC-28 header button opens the modal with readers", async ({ page }) => {
    await openBookingModal(page);
    await expect(modal(page)).toContainText(/Healers|Readers/);
  });

  test("TC-29 selecting a reader shows a titled form", async ({ page }) => {
    await pickFirstReader(page);
    await expect(modal(page)).toContainText(/Booking With/);
    await expect(modal(page).locator('select[name="service"]')).toBeVisible();
  });

  test("TC-30 [BUG-07] submitting sends a request and confirms", async ({ page }) => {
    await pickFirstReader(page);
    const posted = page.waitForRequest((r) => r.method() === "POST" && !r.url().includes("/graphql"), {
      timeout: 5000,
    });
    await modal(page).locator('input[name="fullname"]').fill("Qa Tester");
    await modal(page).locator('input[name="email"]').fill("qa@example.com");
    await modal(page).locator('input[name="contact"]').fill("5551234567");
    await modal(page).getByRole("button", { name: "Book a Session" }).click();
    await posted;
    await expect(modal(page)).toContainText(/booked|confirmed|thank/i);
  });

  test("TC-31 [BUG-07] empty submit shows validation", async ({ page }) => {
    await pickFirstReader(page);
    await modal(page).getByRole("button", { name: "Book a Session" }).click();
    const invalid = await modal(page).locator("form.form :invalid").count();
    expect(invalid).toBeGreaterThan(0);
  });

  test("TC-32 [BUG-09] calendar dates sit under the correct weekday", async ({ page }) => {
    await pickFirstReader(page);
    const cal = modal(page).locator(".calendar");
    const labels = await cal.locator(".day_labels span").allInnerTexts();

    // find the first date cell of the displayed month and its column
    const firstWeek = cal.locator(".week").first();
    const cells = firstWeek.locator(".day");
    const count = await cells.count();
    let col = -1;
    for (let i = 0; i < count; i++) {
      if ((await cells.nth(i).innerText()).trim() === "1") { col = i; break; }
    }
    expect(col).toBeGreaterThanOrEqual(0);

    const title = await cal.locator("h4").innerText(); // e.g. "September 2026"
    const [monthName, year] = title.trim().split(/\s+/);
    const first = new Date(`${monthName} 1, ${year}`);
    const weekday = first.toLocaleDateString("en-US", { weekday: "short" }); // Mon..Sun
    expect(labels[col]).toBe(weekday);
  });

  test("TC-33 past days in the current month are not selectable", async ({ page }) => {
    await pickFirstReader(page);
    const disabled = modal(page).locator(".calendar .day.disabled");
    const today = new Date().getDate();
    expect(await disabled.count()).toBe(today - 1);
  });

  test("TC-34 [BUG-11] cannot navigate before the current month", async ({ page }) => {
    await pickFirstReader(page);
    const cal = modal(page).locator(".calendar");
    const title = await cal.locator("h4").innerText();
    await cal.locator(".cal-header button").first().click(); // prev
    await expect(cal.locator("h4")).toHaveText(title);

    // go forward 14 months, then back 14: must land on the current month, not earlier
    for (let i = 0; i < 14; i++) await cal.locator(".cal-header button").nth(1).click();
    for (let i = 0; i < 20; i++) await cal.locator(".cal-header button").first().click();
    await expect(cal.locator("h4")).toHaveText(title);
  });

  test("TC-35 cancel closes the modal and resets the reader choice", async ({ page }) => {
    await pickFirstReader(page);
    await modal(page).getByRole("button", { name: "Cancel" }).click();
    await page.waitForTimeout(700); // component resets after 500 ms
    await page.getByRole("button", { name: "Book a Session" }).first().click();
    await expect(modal(page)).toContainText(/Please select a Reader or Healer/);
  });

  test("[BUG-15] modal data is not fetched until it is opened", async ({ page }) => {
    let graphqlCalls = 0;
    page.on("request", (r) => r.url().endsWith("/graphql") && r.method() === "POST" && graphqlCalls++);
    await page.goto("/about");
    await page.waitForLoadState("networkidle");
    const before = graphqlCalls;
    // the browser should not fire a readers query before the user opens the modal
    const postData = [] as string[];
    page.on("request", (r) => r.postData() && postData.push(r.postData()!));
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(postData.some((d) => d.includes("preachers"))).toBe(false);
    expect(before).toBeGreaterThanOrEqual(0);
  });
});
