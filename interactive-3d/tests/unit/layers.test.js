import assert from "node:assert/strict";
import test from "node:test";

import { LAYERS, LAYER_IDS, isLayerId } from "../../src/layers.js";

test("layer records preserve the semantic system order", () => {
  assert.deepEqual(LAYER_IDS, ["interface", "state", "delivery"]);
  assert.deepEqual(
    LAYER_IDS.map((id) => LAYERS[id].center),
    [
      [0, 1.5, 0],
      [0, 0, 0],
      [0, -1.5, 0],
    ],
  );
});

test("layer parser rejects unknown boundary input", () => {
  assert.equal(isLayerId("interface"), true);
  assert.equal(isLayerId("unknown"), false);
  assert.equal(isLayerId(null), false);
});
