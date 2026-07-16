import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { Group } from "three";

import { createScene } from "../../src/scene/create-scene.js";

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

test("scene initialization releases acquired resources when setup throws", () => {
  const counts = {
    rendererDispose: 0,
    controlsDispose: 0,
    controlsRemove: 0,
    documentRemove: 0,
  };

  class Renderer {
    setClearColor() {}

    setPixelRatio() {}

    dispose() {
      counts.rendererDispose += 1;
    }
  }

  class Controls {
    target = { set() {} };

    update() {}

    addEventListener() {}

    removeEventListener() {
      counts.controlsRemove += 1;
    }

    dispose() {
      counts.controlsDispose += 1;
    }
  }

  class ThrowingResizeObserver {
    constructor() {
      throw new Error("ResizeObserver setup failed");
    }
  }

  const documentRef = {
    visibilityState: "visible",
    addEventListener() {},
    removeEventListener() {
      counts.documentRemove += 1;
    },
  };

  assert.throws(
    () =>
      createScene(
        {},
        { group: new Group() },
        { clientWidth: 640, clientHeight: 480 },
        {
          Renderer,
          Controls,
          ResizeObserverCtor: ThrowingResizeObserver,
          documentRef,
          devicePixelRatio: 1,
        },
      ),
    /ResizeObserver setup failed/,
  );
  assert.deepEqual(counts, {
    rendererDispose: 1,
    controlsDispose: 1,
    controlsRemove: 1,
    documentRemove: 1,
  });
});
