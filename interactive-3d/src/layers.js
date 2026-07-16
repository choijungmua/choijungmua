export const LAYER_IDS = Object.freeze(["interface", "state", "delivery"]);

export const LAYERS = Object.freeze({
  interface: Object.freeze({
    id: "interface",
    label: "Interface",
    body: "Responsive product UI shaped around clear hierarchy and usable states.",
    center: Object.freeze([0, 1.5, 0]),
  }),
  state: Object.freeze({
    id: "state",
    label: "State",
    body: "Clear state and maintainable structure keep behavior understandable.",
    center: Object.freeze([0, 0, 0]),
  }),
  delivery: Object.freeze({
    id: "delivery",
    label: "Delivery",
    body: "Practical automation helps build, verify, and ship with evidence.",
    center: Object.freeze([0, -1.5, 0]),
  }),
});

export function isLayerId(value) {
  return typeof value === "string" && LAYER_IDS.includes(value);
}
