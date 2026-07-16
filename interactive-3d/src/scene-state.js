import { isLayerId } from "./layers.js";

export function createSelectionState(initialLayer = "interface") {
  if (!isLayerId(initialLayer)) {
    throw new TypeError(`Unknown initial layer: ${String(initialLayer)}`);
  }

  let selectedLayer = initialLayer;

  return Object.freeze({
    get selectedLayer() {
      return selectedLayer;
    },
    select(nextLayer) {
      if (!isLayerId(nextLayer) || nextLayer === selectedLayer) {
        return false;
      }
      selectedLayer = nextLayer;
      return true;
    },
    reset() {
      const changed = selectedLayer !== "interface";
      selectedLayer = "interface";
      return changed;
    },
  });
}
