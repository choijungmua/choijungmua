import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("scene source locks demand rendering and the mobile-safe camera", async () => {
  const source = await readFile(
    new URL("../../src/scene/create-scene.js", import.meta.url),
    "utf8",
  );
  assert.match(source, /camera\.top = 5/);
  assert.match(source, /camera\.bottom = -5/);
  assert.match(source, /controls\.minPolarAngle = 0\.85/);
  assert.match(source, /controls\.maxPolarAngle = 1\.35/);
  assert.match(source, /renderer\.setPixelRatio\(Math\.min\(devicePixelRatio, 2\)\)/);
  assert.doesNotMatch(source, /requestAnimationFrame|setAnimationLoop/);
  assert.match(source, /controls\.enableDamping = false/);
  assert.match(source, /controls\.autoRotate = false/);
});
