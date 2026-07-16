import { Raycaster, Vector2 } from "three";

import { LAYERS, isLayerId } from "./layers.js";
import { createSelectionState } from "./scene-state.js";
import { createScene } from "./scene/create-scene.js";
import { createSystemField } from "./scene/create-system-field.js";
import { createLifecycle } from "./scene/lifecycle.js";
import "./styles.css";

const byId = (id) => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing required element: ${id}`);
  }
  return element;
};

const app = byId("profile-app");
const canvas = byId("system-canvas");
const poster = byId("static-poster");
const viewControls = byId("view-controls");
const retry = byId("retry-3d");
const status = byId("scene-status");
const detailTitle = app.querySelector("[data-detail-title]");
const detailBody = app.querySelector("[data-detail-body]");
const radios = [...app.querySelectorAll('input[name="layer"]')];
const selection = createSelectionState();
const raycaster = new Raycaster();
const pointer = new Vector2();
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");

let activeRuntime = null;

const checkedRadio = () => {
  const checked = radios.find((radio) => radio.checked);
  if (!checked) {
    throw new Error("Layer fieldset has no checked radio.");
  }
  return checked;
};

const updateHtmlSelection = (layerId) => {
  const layer = LAYERS[layerId];
  checkedRadio().checked = false;
  const radio = radios.find((candidate) => candidate.value === layerId);
  if (!radio) {
    return false;
  }
  radio.checked = true;
  detailTitle.textContent = layer.label;
  detailBody.textContent = layer.body;
  return true;
};

const selectLayer = (layerId, announce = true) => {
  if (!isLayerId(layerId) || !updateHtmlSelection(layerId)) {
    return false;
  }
  selection.select(layerId);
  activeRuntime?.field.selectLayer(layerId);
  activeRuntime?.scene.render();
  if (announce) {
    status.textContent = `${LAYERS[layerId].label} layer selected.`;
  }
  return true;
};

const bindCanvasInput = (runtime) => {
  const { scene, field } = runtime;
  scene.controls.enabled = finePointer.matches;
  canvas.style.touchAction = finePointer.matches ? "none" : "pan-y pinch-zoom";
  let origin = null;
  let cancelled = false;

  const onPointerDown = (event) => {
    if (!finePointer.matches || event.button !== 0) {
      return;
    }
    origin = { x: event.clientX, y: event.clientY, id: event.pointerId };
    cancelled = false;
  };

  const cancelPointer = () => {
    origin = null;
    cancelled = true;
  };

  const onPointerUp = (event) => {
    if (!origin || cancelled || event.pointerId !== origin.id || event.button !== 0) {
      origin = null;
      return;
    }
    const distance = Math.hypot(
      event.clientX - origin.x,
      event.clientY - origin.y,
    );
    origin = null;
    if (distance > 8) {
      return;
    }
    const bounds = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, scene.camera);
    const hit = raycaster.intersectObjects(field.pickables, false)[0];
    if (hit?.object.userData.layerId) {
      selectLayer(hit.object.userData.layerId);
    }
  };

  const onWheel = (event) => {
    if (finePointer.matches) {
      scene.zoomBy(event.deltaY < 0 ? 1 : -1);
    }
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", cancelPointer);
  canvas.addEventListener("lostpointercapture", cancelPointer);
  canvas.addEventListener("wheel", onWheel, { passive: true });

  return () => {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", cancelPointer);
    canvas.removeEventListener("lostpointercapture", cancelPointer);
    canvas.removeEventListener("wheel", onWheel);
  };
};

const createRuntime = () => {
  const field = createSystemField();
  const scene = createScene(canvas, field, canvas.parentElement);
  const releaseInput = bindCanvasInput({ field, scene });
  field.selectLayer(selection.selectedLayer);
  scene.render();

  const runtime = {
    field,
    scene,
    render: scene.render,
    dispose() {
      releaseInput();
      scene.dispose();
      field.dispose();
      if (activeRuntime === runtime) {
        activeRuntime = null;
      }
    },
  };
  activeRuntime = runtime;
  return runtime;
};

for (const radio of radios) {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      selectLayer(radio.value);
    }
  });
}

byId("view-rotate-left").addEventListener("click", () =>
  activeRuntime?.scene.rotateBy(-1),
);
byId("view-rotate-right").addEventListener("click", () =>
  activeRuntime?.scene.rotateBy(1),
);
byId("view-zoom-in").addEventListener("click", () =>
  activeRuntime?.scene.zoomBy(1),
);
byId("view-zoom-out").addEventListener("click", () =>
  activeRuntime?.scene.zoomBy(-1),
);
byId("view-reset").addEventListener("click", () => {
  activeRuntime?.scene.resetView();
  selection.reset();
  selectLayer("interface");
});

finePointer.addEventListener("change", ({ matches }) => {
  if (activeRuntime) {
    activeRuntime.scene.controls.enabled = matches;
    canvas.style.touchAction = matches ? "none" : "pan-y pinch-zoom";
  }
});

const lifecycle = createLifecycle(
  { app, canvas, poster, viewControls, retry, status, checkedRadio },
  createRuntime,
);
lifecycle.start();
addEventListener(
  "pagehide",
  (event) => {
    if (!event.persisted) {
      lifecycle.dispose();
    }
  },
);
