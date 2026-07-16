import { expect, test } from "@playwright/test";

test("context loss restores the poster, focus, and one interactive runtime", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator("#profile-app")).toHaveAttribute("data-lifecycle", "ready");
  await page.locator("#view-reset").focus();
  const supported = await page.evaluate(() => {
    const canvas = document.querySelector("#system-canvas");
    const context = canvas.getContext("webgl2");
    const extension = context?.getExtension("WEBGL_lose_context");
    if (!extension) {
      return false;
    }
    globalThis.__restoreWebgl = () => extension.restoreContext();
    extension.loseContext();
    return true;
  });
  test.skip(!supported, "WEBGL_lose_context is unavailable in this Chrome build");
  await expect(page.locator("#profile-app")).toHaveAttribute(
    "data-lifecycle",
    "unavailable",
  );
  await expect(page.locator("#layer-interface")).toBeFocused();
  await page.evaluate(() => globalThis.__restoreWebgl());
  await expect(page.locator("#profile-app")).toHaveAttribute("data-lifecycle", "ready");
  await expect(page.locator("#scene-status")).toHaveText("Interactive 3D restored.");
});
