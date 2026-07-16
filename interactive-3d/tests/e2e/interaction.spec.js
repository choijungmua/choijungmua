import { expect, test } from "@playwright/test";

test("fine-pointer drag changes the scene and passive wheel preserves page scroll", async ({
  page,
}) => {
  await page.goto("./");
  const canvas = page.locator("#system-canvas");
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();
  const before = await canvas.screenshot();
  const center = {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
  await page.mouse.move(center.x, center.y);
  await page.mouse.down();
  await page.mouse.move(center.x + 80, center.y + 20, { steps: 8 });
  await page.mouse.up();
  const after = await canvas.screenshot();
  expect(after.equals(before)).toBe(false);
  await page.mouse.move(center.x, center.y);
  await page.mouse.wheel(0, 320);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

test("an out-and-back drag never becomes a layer click", async ({ page }) => {
  await page.goto("./");
  const canvas = page.locator("#system-canvas");
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();
  const center = {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };

  await expect(page.locator("#layer-interface")).toBeChecked();
  await page.mouse.move(center.x, center.y);
  await page.mouse.down();
  await page.mouse.move(center.x + 40, center.y, { steps: 4 });
  await page.mouse.move(center.x, center.y, { steps: 4 });
  await page.mouse.up();

  await expect(page.locator("#layer-interface")).toBeChecked();
  await expect(page.locator("#scene-status")).not.toContainText("layer selected");
});

test("a stationary canvas click selects the raycast layer", async ({ page }) => {
  await page.goto("./");
  const canvas = page.locator("#system-canvas");
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();

  await page.mouse.click(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );

  await expect(page.locator("#layer-state")).toBeChecked();
  await expect(page.locator("#scene-status")).toHaveText("State layer selected.");
});

test("coarse pointer retains HTML control parity and native touch action", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("./");
  await expect(page.locator("#system-canvas")).toHaveCSS(
    "touch-action",
    "pan-y pinch-zoom",
  );
  await page.locator("label[for=layer-delivery]").click();
  await expect(page.locator("[data-detail-title]")).toHaveText("Delivery");
  await page.locator("#view-reset").click();
  await expect(page.locator("#layer-interface")).toBeChecked();
  await context.close();
});

test("reduced motion and keyboard focus keep the semantic controls usable", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("./");
  const stateRadio = page.locator("#layer-state");
  await stateRadio.focus();
  await expect(page.locator('label[for="layer-state"]')).toHaveCSS(
    "outline-style",
    "solid",
  );
  const duration = await page.locator(".layer-option").first().evaluate(
    (element) => getComputedStyle(element).transitionDuration,
  );
  expect(["0s", "0.00001s", "1e-05s"]).toContain(duration);
  await page.keyboard.press("Space");
  await expect(stateRadio).toBeChecked();
  await context.close();
});

test("200 percent page scale reflows without horizontal document scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("./");
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
  await expect
    .poll(() => page.evaluate(() => visualViewport?.scale ?? 1))
    .toBe(2);
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 1 });
});
