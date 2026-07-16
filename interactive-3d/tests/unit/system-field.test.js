import assert from "node:assert/strict";
import test from "node:test";

import { BackSide } from "three";

import { createSystemField } from "../../src/scene/create-system-field.js";

test("system field creates exact selectable layers and a non-occluding silhouette", () => {
  const field = createSystemField();
  assert.equal(field.group.name, "system-field");
  assert.deepEqual(
    field.pickables.map((mesh) => mesh.name),
    ["layer-interface", "layer-state", "layer-delivery"],
  );
  const selection = field.group.getObjectByName("selection-interface");
  assert.equal(selection.visible, true);
  assert.equal(selection.material.side, BackSide);
  assert.equal(selection.material.depthTest, true);
  assert.equal(selection.material.depthWrite, false);
  assert.equal(field.group.getObjectByName("system-grid").children.length, 12);
  assert.equal(field.group.getObjectByName("system-route").renderOrder, 3);
  field.dispose();
});

test("system field selection rejects unknown values without mutation", () => {
  const field = createSystemField();
  assert.equal(field.selectLayer("delivery"), true);
  assert.equal(field.selectedLayer, "delivery");
  assert.equal(field.selectLayer("unknown"), false);
  assert.equal(field.selectedLayer, "delivery");
  assert.equal(field.group.getObjectByName("selection-delivery").visible, true);
  assert.doesNotThrow(() => {
    field.dispose();
    field.dispose();
  });
});
