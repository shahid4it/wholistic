# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> Booking >> TC-30 [BUG-07] submitting sends a request and confirms
- Location: e2e/booking.spec.ts:24:7

# Error details

```
TimeoutError: page.waitForRequest: Timeout 5000ms exceeded while waiting for event "request"
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link [ref=e5] [cursor=pointer]:
        - /url: /
        - img "Wholistic Logo" [ref=e6]
      - navigation [ref=e8]:
        - list [ref=e9]:
          - listitem [ref=e10]:
            - link "Readers" [ref=e11] [cursor=pointer]:
              - /url: /readers
          - listitem [ref=e12]:
            - link "Services" [ref=e13] [cursor=pointer]:
              - /url: /services
          - listitem [ref=e14]:
            - generic [ref=e15]: Resources
          - listitem [ref=e16]:
            - link "About" [ref=e17] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e18]:
            - link "Contact" [ref=e19] [cursor=pointer]:
              - /url: /contact
          - listitem [ref=e20]:
            - link "Login" [ref=e21] [cursor=pointer]:
              - /url: /auth/login
          - listitem [ref=e22]:
            - button "Book a Session" [ref=e23] [cursor=pointer]
  - generic [ref=e24]:
    - generic [ref=e25]:
      - img "Hero Background" [ref=e27]
      - generic [ref=e28]:
        - heading "Your companion in wholeness" [level=1] [ref=e29]
        - paragraph [ref=e30]: Readings and healing.
        - link:
          - /url: ""
    - generic [ref=e33]:
      - img "Hero Background" [ref=e36]
      - paragraph [ref=e38]: <p>Welcome to Wholistic.</p>
    - generic [ref=e39]:
      - generic [ref=e41]:
        - generic [ref=e42]: SERVICES
        - generic [ref=e43]: SERVICES
      - generic [ref=e46]:
        - heading "Services" [level=3] [ref=e48]
        - paragraph [ref=e51]: What we offer
      - generic [ref=e54]:
        - img "Tarot Reading" [ref=e57]
        - list [ref=e60]:
          - listitem [ref=e61]:
            - link "Tarot Reading" [ref=e62] [cursor=pointer]:
              - /url: /services/tarot-reading
          - listitem [ref=e64]:
            - link "Astrology" [ref=e65] [cursor=pointer]:
              - /url: /services/astrology
          - listitem [ref=e67]:
            - link "Reiki Healing" [ref=e68] [cursor=pointer]:
              - /url: /services/reiki-healing
    - generic [ref=e70]:
      - generic [ref=e72]:
        - generic [ref=e73]: READERS
        - generic [ref=e74]: READERS
      - generic [ref=e77]:
        - generic [ref=e79]:
          - img "Reader Image" [ref=e81]
          - generic [ref=e82]:
            - generic [ref=e83]:
              - generic [ref=e84]:
                - heading [level=3] [ref=e85]:
                  - link "Aria Moon" [ref=e86] [cursor=pointer]:
                    - /url: /readers/aria-moon
                - generic [ref=e87]:
                  - generic [ref=e88]: "4.7"
                  - generic [ref=e91]: (4658)
              - paragraph [ref=e93]: Guidance with Aria Moon
              - generic [ref=e94]:
                - link "love" [ref=e95] [cursor=pointer]:
                  - /url: "#"
                - link "career" [ref=e96] [cursor=pointer]:
                  - /url: "#"
            - button "Book a session" [ref=e97] [cursor=pointer]
        - generic [ref=e99]:
          - img "Reader Image" [ref=e101]
          - generic [ref=e102]:
            - generic [ref=e103]:
              - generic [ref=e104]:
                - heading [level=3] [ref=e105]:
                  - link "Leo Sterling" [ref=e106] [cursor=pointer]:
                    - /url: /readers/leo-sterling
                - generic [ref=e107]:
                  - generic [ref=e108]: "4.7"
                  - generic [ref=e111]: (4658)
              - paragraph [ref=e113]: Guidance with Leo Sterling
              - generic [ref=e114]:
                - link "love" [ref=e115] [cursor=pointer]:
                  - /url: "#"
                - link "career" [ref=e116] [cursor=pointer]:
                  - /url: "#"
            - button "Book a session" [ref=e117] [cursor=pointer]
        - generic [ref=e119]:
          - img "Reader Image" [ref=e121]
          - generic [ref=e122]:
            - generic [ref=e123]:
              - generic [ref=e124]:
                - heading [level=3] [ref=e125]:
                  - link "Sage Willow" [ref=e126] [cursor=pointer]:
                    - /url: /readers/sage-willow
                - generic [ref=e127]:
                  - generic [ref=e128]: "4.7"
                  - generic [ref=e131]: (4658)
              - paragraph [ref=e133]: Guidance with Sage Willow
              - generic [ref=e134]:
                - link "love" [ref=e135] [cursor=pointer]:
                  - /url: "#"
                - link "career" [ref=e136] [cursor=pointer]:
                  - /url: "#"
            - button "Book a session" [ref=e137] [cursor=pointer]
      - option "10:00am - 10:30am" [selected]
      - option "11:15am - 12:15pm"
      - option "12:30pm - 1:30pm"
    - generic [ref=e139]:
      - img "Hero Background" [ref=e141]
      - heading "What clients say" [level=3] [ref=e143]
      - generic [ref=e144]:
        - generic [ref=e146]:
          - generic [ref=e148]:
            - heading "“<p>Jane D. loved the session.</p>”" [level=3] [ref=e156]
            - heading "Jane D." [level=4] [ref=e158]
          - generic [ref=e160]:
            - heading "“<p>Mark T. loved the session.</p>”" [level=3] [ref=e168]
            - heading "Mark T." [level=4] [ref=e170]
          - generic [ref=e172]:
            - heading "“<p>Priya S. loved the session.</p>”" [level=3] [ref=e180]
            - heading "Priya S." [level=4] [ref=e182]
        - generic:
          - button [ref=e183] [cursor=pointer]
          - button [ref=e186] [cursor=pointer]
    - generic [ref=e189]:
      - generic [ref=e192]:
        - heading "FAQs" [level=3] [ref=e194]
        - paragraph [ref=e197]: Common questions
      - generic [ref=e200]:
        - list [ref=e202]:
          - listitem [ref=e203]:
            - generic "How do sessions work?" [ref=e204] [cursor=pointer]
          - listitem [ref=e207]:
            - generic "Can I cancel?" [ref=e208] [cursor=pointer]
        - img "FAQ's" [ref=e213]
  - generic [ref=e216]:
    - img "Hero Background" [ref=e219]
    - generic [ref=e221]:
      - generic [ref=e222]:
        - heading "Newsletter" [level=2] [ref=e223]
        - paragraph [ref=e224]: Stay in touch
      - generic [ref=e225]:
        - generic [ref=e226]:
          - generic [ref=e227]: Full Name
          - textbox "Enter your name" [ref=e228]
        - generic [ref=e229]:
          - generic [ref=e230]: Email Address
          - textbox "Enter your email address" [ref=e231]
        - button "Sign up" [ref=e232] [cursor=pointer]
  - contentinfo [ref=e233]:
    - generic [ref=e235]:
      - link [ref=e237] [cursor=pointer]:
        - /url: /
        - img "Wholistic Logo" [ref=e238]
      - generic [ref=e239]:
        - heading "Quick Links" [level=3] [ref=e240]
        - navigation [ref=e241]:
          - list [ref=e242]:
            - listitem [ref=e243]:
              - link "About" [ref=e244] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e245]:
              - link "Contact" [ref=e246] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e247]:
        - heading "Our Services" [level=3] [ref=e248]
        - navigation [ref=e249]:
          - list [ref=e250]:
            - listitem [ref=e251]:
              - link "Tarot Reading" [ref=e252] [cursor=pointer]:
                - /url: /services/tarot-reading
            - listitem [ref=e253]:
              - link "Astrology" [ref=e254] [cursor=pointer]:
                - /url: /services/astrology
            - listitem [ref=e255]:
              - link "Reiki Healing" [ref=e256] [cursor=pointer]:
                - /url: /services/reiki-healing
      - generic [ref=e257]:
        - generic [ref=e258]:
          - paragraph [ref=e259]: Stay Connected
          - list:
            - listitem:
              - link:
                - /url: https://instagram.com
        - paragraph [ref=e261]: © 2026 Wholistic
  - article [ref=e262]:
    - button [ref=e263]
    - generic [ref=e264]:
      - generic [ref=e265]:
        - heading "Booking With Sage Willow" [level=3] [ref=e266]
        - button [ref=e267] [cursor=pointer]
      - generic [ref=e271]:
        - generic [ref=e272]:
          - generic [ref=e273]:
            - generic [ref=e274]:
              - heading "September 2026" [level=4] [ref=e275]
              - generic [ref=e276]:
                - button [ref=e277] [cursor=pointer]
                - button [ref=e280] [cursor=pointer]
            - generic [ref=e283]:
              - generic [ref=e284]:
                - generic [ref=e285]: Mon
                - generic [ref=e286]: Tue
                - generic [ref=e287]: Wed
                - generic [ref=e288]: Thu
                - generic [ref=e289]: Fri
                - generic [ref=e290]: Sat
                - generic [ref=e291]: Sun
              - generic [ref=e292]:
                - generic [ref=e294]: "1"
                - generic [ref=e295]: "2"
                - generic [ref=e296]: "3"
                - generic [ref=e297]: "4"
                - generic [ref=e298]: "5"
                - generic [ref=e299]: "6"
              - generic [ref=e300]:
                - generic [ref=e301]: "7"
                - generic [ref=e302]: "8"
                - generic [ref=e303]: "9"
                - generic [ref=e304]: "10"
                - generic [ref=e305]: "11"
                - generic [ref=e306]: "12"
                - generic [ref=e307]: "13"
              - generic [ref=e308]:
                - generic [ref=e309]: "14"
                - generic [ref=e310]: "15"
                - generic [ref=e311]: "16"
                - generic [ref=e312]: "17"
                - generic [ref=e313]: "18"
                - generic [ref=e314]: "19"
                - button "20" [ref=e315]
              - generic [ref=e316]:
                - button "21" [ref=e317]
                - button "22" [ref=e318]
                - button "23" [ref=e319]
                - button "24" [ref=e320]
                - button "25" [ref=e321]
                - button "26" [ref=e322]
                - button "27" [ref=e323]
              - generic [ref=e324]:
                - button "28" [ref=e325]
                - button "29" [ref=e326]
                - button "30" [ref=e327]
          - generic [ref=e340]:
            - generic [ref=e341]: Time Slot
            - combobox "Time Slot" [ref=e342]:
              - option "10:00am - 10:30am" [selected]
              - option "11:15am - 12:15pm"
              - option "12:30pm - 1:30pm"
        - generic [ref=e343]:
          - generic [ref=e344]:
            - generic [ref=e345]: Full Name
            - textbox "Full Name" [ref=e346]: Qa Tester
          - generic [ref=e347]:
            - generic [ref=e348]:
              - generic [ref=e349]: Email
              - textbox "Email" [ref=e350]: qa@example.com
            - generic [ref=e351]:
              - generic [ref=e352]: Contact
              - textbox "Contact" [ref=e353]: "5551234567"
          - generic [ref=e355]:
            - generic [ref=e356]: Services
            - combobox "Services" [ref=e357]:
              - option "Reiki Healing" [selected]
          - generic [ref=e358]:
            - generic [ref=e359]: Message
            - textbox "Message" [ref=e360]
          - generic [ref=e361]:
            - button "Book a Session" [active] [ref=e362] [cursor=pointer]
            - button "Cancel" [ref=e363] [cursor=pointer]
  - alert [ref=e364]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import { openBookingModal } from "./helpers";
  3   | 
  4   | const modal = (page) => page.locator("#modal-container");
  5   | 
  6   | async function pickFirstReader(page) {
  7   |   await openBookingModal(page);
  8   |   await modal(page).getByRole("button", { name: "Book a Session" }).first().click();
  9   |   await expect(modal(page).locator("form.form")).toBeVisible();
  10  | }
  11  | 
  12  | test.describe("Booking", () => {
  13  |   test("TC-28 header button opens the modal with readers", async ({ page }) => {
  14  |     await openBookingModal(page);
  15  |     await expect(modal(page)).toContainText(/Healers|Readers/);
  16  |   });
  17  | 
  18  |   test("TC-29 selecting a reader shows a titled form", async ({ page }) => {
  19  |     await pickFirstReader(page);
  20  |     await expect(modal(page)).toContainText(/Booking With/);
  21  |     await expect(modal(page).locator('select[name="service"]')).toBeVisible();
  22  |   });
  23  | 
  24  |   test("TC-30 [BUG-07] submitting sends a request and confirms", async ({ page }) => {
  25  |     await pickFirstReader(page);
> 26  |     const posted = page.waitForRequest((r) => r.method() === "POST" && !r.url().includes("/graphql"), {
      |                         ^ TimeoutError: page.waitForRequest: Timeout 5000ms exceeded while waiting for event "request"
  27  |       timeout: 5000,
  28  |     });
  29  |     await modal(page).locator('input[name="fullname"]').fill("Qa Tester");
  30  |     await modal(page).locator('input[name="email"]').fill("qa@example.com");
  31  |     await modal(page).locator('input[name="contact"]').fill("5551234567");
  32  |     await modal(page).getByRole("button", { name: "Book a Session" }).click();
  33  |     await posted;
  34  |     await expect(modal(page)).toContainText(/booked|confirmed|thank/i);
  35  |   });
  36  | 
  37  |   test("TC-31 [BUG-07] empty submit shows validation", async ({ page }) => {
  38  |     await pickFirstReader(page);
  39  |     await modal(page).getByRole("button", { name: "Book a Session" }).click();
  40  |     const invalid = await modal(page).locator("form.form :invalid").count();
  41  |     expect(invalid).toBeGreaterThan(0);
  42  |   });
  43  | 
  44  |   test("TC-32 [BUG-09] calendar dates sit under the correct weekday", async ({ page }) => {
  45  |     await pickFirstReader(page);
  46  |     const cal = modal(page).locator(".calendar");
  47  |     const labels = await cal.locator(".day_labels span").allInnerTexts();
  48  | 
  49  |     // find the first date cell of the displayed month and its column
  50  |     const firstWeek = cal.locator(".week").first();
  51  |     const cells = firstWeek.locator(".day");
  52  |     const count = await cells.count();
  53  |     let col = -1;
  54  |     for (let i = 0; i < count; i++) {
  55  |       if ((await cells.nth(i).innerText()).trim() === "1") { col = i; break; }
  56  |     }
  57  |     expect(col).toBeGreaterThanOrEqual(0);
  58  | 
  59  |     const title = await cal.locator("h4").innerText(); // e.g. "September 2026"
  60  |     const [monthName, year] = title.trim().split(/\s+/);
  61  |     const first = new Date(`${monthName} 1, ${year}`);
  62  |     const weekday = first.toLocaleDateString("en-US", { weekday: "short" }); // Mon..Sun
  63  |     expect(labels[col]).toBe(weekday);
  64  |   });
  65  | 
  66  |   test("TC-33 past days in the current month are not selectable", async ({ page }) => {
  67  |     await pickFirstReader(page);
  68  |     const disabled = modal(page).locator(".calendar .day.disabled");
  69  |     const today = new Date().getDate();
  70  |     expect(await disabled.count()).toBe(today - 1);
  71  |   });
  72  | 
  73  |   test("TC-34 [BUG-11] cannot navigate before the current month", async ({ page }) => {
  74  |     await pickFirstReader(page);
  75  |     const cal = modal(page).locator(".calendar");
  76  |     const title = await cal.locator("h4").innerText();
  77  |     await cal.locator(".cal-header button").first().click(); // prev
  78  |     await expect(cal.locator("h4")).toHaveText(title);
  79  | 
  80  |     // go forward 14 months, then back 14: must land on the current month, not earlier
  81  |     for (let i = 0; i < 14; i++) await cal.locator(".cal-header button").nth(1).click();
  82  |     for (let i = 0; i < 20; i++) await cal.locator(".cal-header button").first().click();
  83  |     await expect(cal.locator("h4")).toHaveText(title);
  84  |   });
  85  | 
  86  |   test("TC-35 cancel closes the modal and resets the reader choice", async ({ page }) => {
  87  |     await pickFirstReader(page);
  88  |     await modal(page).getByRole("button", { name: "Cancel" }).click();
  89  |     await page.waitForTimeout(700); // component resets after 500 ms
  90  |     await page.getByRole("button", { name: "Book a Session" }).first().click();
  91  |     await expect(modal(page)).toContainText(/Please select a Reader or Healer/);
  92  |   });
  93  | 
  94  |   test("[BUG-15] modal data is not fetched until it is opened", async ({ page }) => {
  95  |     let graphqlCalls = 0;
  96  |     page.on("request", (r) => r.url().endsWith("/graphql") && r.method() === "POST" && graphqlCalls++);
  97  |     await page.goto("/about");
  98  |     await page.waitForLoadState("networkidle");
  99  |     const before = graphqlCalls;
  100 |     // the browser should not fire a readers query before the user opens the modal
  101 |     const postData = [] as string[];
  102 |     page.on("request", (r) => r.postData() && postData.push(r.postData()!));
  103 |     await page.reload();
  104 |     await page.waitForLoadState("networkidle");
  105 |     expect(postData.some((d) => d.includes("preachers"))).toBe(false);
  106 |     expect(before).toBeGreaterThanOrEqual(0);
  107 |   });
  108 | });
  109 | 
```