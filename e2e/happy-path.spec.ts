import { test, expect } from "@playwright/test";

/**
 * Happy-path smoke test.
 *
 * Prerequisites:
 * - Backend running on http://localhost:8000
 * - A test user session cookie (SESSION_COOKIE env var) set via the backend's
 *   test fixture endpoint, or manually extracted from a real sign-in.
 *
 * The test injects the cookie directly so it never drives the Google OAuth flow.
 */

const SESSION_COOKIE = process.env.SESSION_COOKIE ?? "";

test.describe("Personal Secretary happy path", () => {
  test.beforeEach(async ({ context }) => {
    if (!SESSION_COOKIE) {
      test.skip();
    }
    await context.addCookies([
      {
        name: "session",
        value: SESSION_COOKIE,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
  });

  test("root redirects to /plans when authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/plans/);
  });

  test("create a plan and view the task tree", async ({ page }) => {
    await page.goto("/plans/new");
    await page.getByRole("textbox").fill("Build a personal blog in 2 weeks");
    await page.getByRole("button", { name: /generate plan/i }).click();
    // Wait up to 30s for the AI call
    await page.waitForURL(/\/plans\/.+/, { timeout: 35_000 });
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("/signin is accessible when unauthenticated", async ({ browser }) => {
    const ctx = await browser.newContext(); // no cookies
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/signin/);
    await expect(
      page.getByRole("link", { name: /sign in with google/i })
    ).toBeVisible();
    await ctx.close();
  });
});
