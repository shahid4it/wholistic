import { test, expect, Page } from "@playwright/test";
import { PASSWORD, STRAPI_URL, signup, uniqueEmail } from "./helpers";

// Podcasts and videos are members only: logged-out visitors get a "Members
// only" gate with Login / Sign up, and the media itself is never sent to them.

/** First entry of a resource category in Strapi, or undefined if there is none. */
async function firstEntry(page: Page, category: string) {
  const res = await page.request.post(`${STRAPI_URL}/graphql`, {
    data: {
      query: `{ blogs(filters: { category: { eq: "${category}" } }, pagination: { limit: 1 }) { slug title resourceUrl resource { url } } }`,
    },
  });
  const entry = (await res.json())?.data?.blogs?.[0];
  return entry as { slug: string; title: string; resourceUrl?: string; resource?: { url: string } } | undefined;
}

const gate = (page: Page) => page.locator(".members-only");

test.describe("Members-only podcasts and videos", () => {
  test("TC-50 logged-out visitors see the gate, not the podcasts or videos", async ({ page }) => {
    const video = await firstEntry(page, "video");
    const podcast = await firstEntry(page, "podcast");

    for (const path of ["/resources/podcast", "/resources/online-classes", "/resources/video"]) {
      await page.goto(path);
      await expect(gate(page)).toContainText("Members only");
      await expect(gate(page).getByRole("link", { name: "Login" })).toHaveAttribute(
        "href",
        `/auth/login?next=${encodeURIComponent(path)}`
      );
      await expect(page.locator(".resources__content")).toHaveCount(0);
    }

    // the media links must not be in the HTML at all, not just hidden
    await page.goto("/resources/video");
    if (video?.resourceUrl) expect(await page.content()).not.toContain(video.resourceUrl);

    if (podcast) {
      await page.goto(`/resources/podcast/${podcast.slug}`);
      await expect(gate(page)).toBeVisible();
      await expect(page.locator("audio")).toHaveCount(0);
      const html = await page.content();
      expect(html).not.toContain(podcast.title);
      for (const url of [podcast.resourceUrl, podcast.resource?.url]) if (url) expect(html).not.toContain(url);
    }
  });

  test("TC-51 the blog URL can't be used to get around the gate", async ({ page }) => {
    const video = await firstEntry(page, "video");
    const podcast = await firstEntry(page, "podcast");
    test.skip(!video && !podcast, "needs a video or podcast entry in Strapi");

    if (video) {
      await page.goto(`/resources/blog/${video.slug}`);
      await expect(page).toHaveURL(/\/resources\/video$/);
      await expect(gate(page)).toBeVisible();
    }
    if (podcast) {
      await page.goto(`/resources/blog/${podcast.slug}`);
      await expect(page).toHaveURL(new RegExp(`/resources/podcast/${podcast.slug}$`));
      await expect(gate(page)).toBeVisible();
    }
  });

  test("TC-52 signing up from the gate returns to the page and shows the content", async ({ page }) => {
    await page.goto("/resources/video");
    await gate(page).getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/\/auth\/signup\?next=%2Fresources%2Fvideo/);

    await page.locator('input[name="firstName"]').fill("Qa");
    await page.locator('input[name="lastName"]').fill("Member");
    await page.locator('input[name="email"]').fill(uniqueEmail("member"));
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.locator('input[name="repassword"]').fill(PASSWORD);
    await page.getByRole("button", { name: "Subscribe" }).click();

    await expect(page).toHaveURL(/\/resources\/video$/);
    await expect(gate(page)).toHaveCount(0);
    await expect(page.locator(".resources__content")).toBeVisible();
  });

  test("TC-53 logged-in members see podcasts and videos", async ({ page }) => {
    await signup(page);
    await expect(page).toHaveURL(/\/$/);

    for (const path of ["/resources/podcast", "/resources/online-classes", "/resources/video"]) {
      await page.goto(path);
      await expect(gate(page)).toHaveCount(0);
      await expect(page.locator(".resources__content")).toBeVisible();
    }

    const podcast = await firstEntry(page, "podcast");
    if (podcast) {
      await page.goto("/resources/podcast");
      await expect(page.locator(".resources__content")).toContainText(podcast.title);
      await page.goto(`/resources/podcast/${podcast.slug}`);
      await expect(page.locator("audio")).toHaveCount(1);
    }
    const video = await firstEntry(page, "video");
    if (video) {
      await page.goto("/resources/video");
      await expect(page.locator(".resources__content")).toContainText(video.title);
    }
  });

  test("TC-55 the menu's /resources/lecture link reaches the (gated) online classes", async ({ page }) => {
    await page.goto("/resources/lecture");
    await expect(page).toHaveURL(/\/resources\/online-classes$/);
    await expect(gate(page)).toContainText("online classes");
  });

  test("TC-54 ?next= can't redirect to another site", async ({ page }) => {
    await page.goto("/auth/signup?next=//example.org/phish");
    await page.locator('input[name="firstName"]').fill("Qa");
    await page.locator('input[name="lastName"]').fill("Next");
    await page.locator('input[name="email"]').fill(uniqueEmail("next"));
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.locator('input[name="repassword"]').fill(PASSWORD);
    await page.getByRole("button", { name: "Subscribe" }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/");
    expect(new URL(page.url()).hostname).not.toBe("example.org");
  });
});
