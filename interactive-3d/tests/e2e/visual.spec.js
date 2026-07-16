import { expect, test } from "@playwright/test";

test("captures the ready interface at three responsive widths", async ({ page }, testInfo) => {
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: width === 1280 ? 800 : 900 });
    await page.goto("./");
    await expect(page.locator("#profile-app")).toHaveAttribute("data-lifecycle", "ready");
    await page.screenshot({
      path: testInfo.outputPath(`interactive-${width}.png`),
      fullPage: true,
    });
  }
});
