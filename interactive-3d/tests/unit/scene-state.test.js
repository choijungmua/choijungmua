import assert from "node:assert/strict";
import test from "node:test";

import { createSelectionState } from "../../src/scene-state.js";

test("selection state changes only for known distinct layers", () => {
  const state = createSelectionState();
  assert.equal(state.selectedLayer, "interface");
  assert.equal(state.select("state"), true);
  assert.equal(state.selectedLayer, "state");
  assert.equal(state.select("state"), false);
  assert.equal(state.select("unknown"), false);
  assert.equal(state.selectedLayer, "state");
});

test("selection state resets to interface", () => {
  const state = createSelectionState("delivery");
  assert.equal(state.reset(), true);
  assert.equal(state.selectedLayer, "interface");
  assert.equal(state.reset(), false);
});
