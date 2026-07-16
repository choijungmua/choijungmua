import {
  BackSide,
  BoxGeometry,
  BufferGeometry,
  EdgesGeometry,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";

import { LAYERS, LAYER_IDS, isLayerId } from "../layers.js";

const FACE_COLORS = Object.freeze([
  0x11151a,
  0x0b0d10,
  0x181d24,
  0x0b0d10,
  0x181d24,
  0x11151a,
]);
const GRID_COORDINATES = Object.freeze([-3, -1.8, -0.6, 0.6, 1.8, 3]);
const NODE_POSITIONS = Object.freeze([
  Object.freeze([-1.4, 0.24, -0.6]),
  Object.freeze([0, 0.24, 0]),
  Object.freeze([1.4, 0.24, 0.6]),
]);

function makeLine(name, start, end, color, renderOrder = 0) {
  const geometry = new BufferGeometry().setFromPoints([
    new Vector3(...start),
    new Vector3(...end),
  ]);
  const line = new Line(geometry, new LineBasicMaterial({ color }));
  line.name = name;
  line.renderOrder = renderOrder;
  return line;
}

export function createSystemField() {
  const group = new Group();
  group.name = "system-field";

  const resources = new Set();
  const pickables = [];
  const selections = new Map();

  const grid = new Group();
  grid.name = "system-grid";
  for (const coordinate of GRID_COORDINATES) {
    grid.add(
      makeLine(
        `grid-x-${coordinate}`,
        [-4, -1.7, coordinate],
        [4, -1.7, coordinate],
        0x30363d,
      ),
      makeLine(
        `grid-z-${coordinate}`,
        [coordinate, -1.7, -3],
        [coordinate, -1.7, 3],
        0x30363d,
      ),
    );
  }
  group.add(grid);

  for (const layerId of LAYER_IDS) {
    const layer = LAYERS[layerId];
    const center = new Vector3(...layer.center);

    const selectionGeometry = new BoxGeometry(4.96, 0.36, 2.96);
    const selectionMaterial = new MeshBasicMaterial({
      color: 0x58a6ff,
      side: BackSide,
      depthTest: true,
      depthWrite: false,
    });
    const selection = new Mesh(selectionGeometry, selectionMaterial);
    selection.name = `selection-${layerId}`;
    selection.position.copy(center);
    selection.renderOrder = 0;
    selection.visible = layerId === "interface";
    selections.set(layerId, selection);
    resources.add(selectionGeometry);
    resources.add(selectionMaterial);
    group.add(selection);

    const slabGeometry = new BoxGeometry(4.8, 0.28, 2.8);
    const slabMaterials = FACE_COLORS.map(
      (color) => new MeshBasicMaterial({ color }),
    );
    const slab = new Mesh(slabGeometry, slabMaterials);
    slab.name = `layer-${layerId}`;
    slab.position.copy(center);
    slab.renderOrder = 1;
    slab.userData.layerId = layerId;
    pickables.push(slab);
    resources.add(slabGeometry);
    slabMaterials.forEach((material) => resources.add(material));
    group.add(slab);

    const edgeGeometry = new EdgesGeometry(slabGeometry);
    const edgeMaterial = new LineBasicMaterial({ color: 0x6e7681 });
    const edges = new LineSegments(edgeGeometry, edgeMaterial);
    edges.name = `edges-${layerId}`;
    edges.position.copy(center);
    edges.renderOrder = 2;
    resources.add(edgeGeometry);
    resources.add(edgeMaterial);
    group.add(edges);

    NODE_POSITIONS.forEach((position, index) => {
      const nodeGeometry = new BoxGeometry(0.32, 0.16, 0.32);
      const nodeMaterial = new MeshBasicMaterial({ color: 0x6e7681 });
      const node = new Mesh(nodeGeometry, nodeMaterial);
      node.name = `node-${layerId}-${index + 1}`;
      node.position.set(
        position[0],
        center.y + position[1],
        position[2],
      );
      node.renderOrder = 2;
      resources.add(nodeGeometry);
      resources.add(nodeMaterial);
      group.add(node);
    });
  }

  const routeGeometry = new BufferGeometry().setFromPoints([
    new Vector3(-1.6, 1.66, -0.6),
    new Vector3(0, 1.66, 0),
    new Vector3(1.4, 0.16, 0.5),
    new Vector3(0, -1.34, 0),
  ]);
  const routeMaterial = new LineBasicMaterial({ color: 0x58a6ff });
  const route = new Line(routeGeometry, routeMaterial);
  route.name = "system-route";
  route.renderOrder = 3;
  resources.add(routeGeometry);
  resources.add(routeMaterial);
  group.add(route);

  let selectedLayer = "interface";
  let disposed = false;

  return Object.freeze({
    group,
    pickables: Object.freeze([...pickables]),
    get selectedLayer() {
      return selectedLayer;
    },
    selectLayer(layerId) {
      if (!isLayerId(layerId) || disposed) {
        return false;
      }
      selectedLayer = layerId;
      for (const [id, selection] of selections) {
        selection.visible = id === layerId;
      }
      return true;
    },
    dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      for (const resource of resources) {
        resource.dispose();
      }
    },
  });
}
