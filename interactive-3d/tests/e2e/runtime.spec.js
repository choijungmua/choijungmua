import { expect, test } from "@playwright/test";

test("production experience selects layers and resets the view", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("./");
  await expect(page.locator("#profile-app")).toHaveAttribute("data-lifecycle", "ready");
  await expect(page.locator("#system-canvas")).toBeVisible();
  await page.locator("label[for=layer-state]").click();
  await expect(page.locator("[data-detail-title]")).toHaveText("State");
  await expect(page.locator("#scene-status")).toHaveText("State layer selected.");
  await page.locator("#view-reset").click();
  await expect(page.locator("#layer-interface")).toBeChecked();
  await expect(page.locator("[data-detail-title]")).toHaveText("Interface");
  await page.locator("#view-rotate-left").click();
  await page.locator("#view-rotate-right").click();
  await page.locator("#view-zoom-in").click();
  await page.locator("#view-zoom-out").click();
  expect(pageErrors).toEqual([]);
});

test("production experience retains semantic content without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("./");
  await expect(page.locator("#static-poster")).toBeVisible();
  await expect(page.locator("#layer-fieldset")).toBeVisible();
  await expect(page.locator(".layer-summaries p")).toHaveCount(3);
  await context.close();
});
