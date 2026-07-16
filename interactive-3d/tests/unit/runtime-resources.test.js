import assert from "node:assert/strict";
import test from "node:test";

import { createRuntimeResources } from "../../src/scene/runtime-resources.js";

test("runtime initialization disposes the field when scene creation throws", () => {
  let fieldDisposeCount = 0;
  const field = {
    dispose() {
      fieldDisposeCount += 1;
    },
  };

  assert.throws(
    () =>
      createRuntimeResources({
        createField: () => field,
        createScene: () => {
          throw new Error("scene setup failed");
        },
        bindInput: () => () => {},
        initialLayer: "interface",
      }),
    /scene setup failed/,
  );
  assert.equal(fieldDisposeCount, 1);
});

test("runtime initialization disposes the scene when input binding throws", () => {
  let fieldDisposeCount = 0;
  let sceneDisposeCount = 0;
  const field = {
    dispose() {
      fieldDisposeCount += 1;
    },
  };
  const scene = {
    dispose() {
      sceneDisposeCount += 1;
    },
  };

  assert.throws(
    () =>
      createRuntimeResources({
        createField: () => field,
        createScene: () => scene,
        bindInput: () => {
          throw new Error("input setup failed");
        },
        initialLayer: "interface",
      }),
    /input setup failed/,
  );
  assert.equal(sceneDisposeCount, 1);
  assert.equal(fieldDisposeCount, 1);
});
