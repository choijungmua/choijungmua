import { expect, test } from "@playwright/test";

test("WebGL failure keeps the semantic experience and offers retry", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("#profile-app")).toHaveAttribute(
    "data-lifecycle",
    "unavailable",
  );
  await expect(page.locator("#static-poster")).toBeVisible();
  await expect(page.locator("#system-canvas")).toBeHidden();
  await expect(page.locator("#retry-3d")).toBeVisible();
  await expect(page.locator("#scene-status")).toHaveText(
    "Interactive 3D unavailable. Layer details remain available.",
  );
  await expect(page.locator(".layer-summaries p")).toHaveCount(3);
  await page.locator("label[for=layer-delivery]").click();
  await expect(page.locator("[data-detail-title]")).toHaveText("Delivery");
  await page.locator("#retry-3d").click();
  await expect(page.locator("#profile-app")).toHaveAttribute(
    "data-lifecycle",
    "unavailable",
  );
  await expect(page.locator("#retry-3d")).toBeFocused();
});
