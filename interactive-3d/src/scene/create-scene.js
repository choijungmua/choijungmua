import {
  OrthographicCamera,
  Scene,
  Spherical,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const DEFAULT_POSITION = Object.freeze([8, 6, 9]);
const DEFAULT_TARGET = Object.freeze([0, 0, 0]);
const AZIMUTH_RANGE = Object.freeze([-0.9, 0.9]);
const ZOOM_RANGE = Object.freeze([0.85, 1.6]);

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

export function createScene(canvas, field, container, dependencies = {}) {
  const Renderer = dependencies.Renderer ?? WebGLRenderer;
  const Controls = dependencies.Controls ?? OrbitControls;
  const ResizeObserverCtor =
    dependencies.ResizeObserverCtor ?? globalThis.ResizeObserver;
  const documentRef = dependencies.documentRef ?? globalThis.document;
  const devicePixelRatio =
    dependencies.devicePixelRatio ?? globalThis.devicePixelRatio ?? 1;

  const scene = new Scene();
  scene.add(field.group);

  const camera = new OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
  camera.position.set(...DEFAULT_POSITION);
  camera.zoom = 1;

  let renderer = null;
  let controls = null;
  let resizeObserver = null;
  let controlsListening = false;
  let documentListening = false;
  let disposed = false;

  const releaseResources = () => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    if (documentListening) {
      documentRef.removeEventListener("visibilitychange", onVisibilityChange);
      documentListening = false;
    }
    if (controlsListening) {
      controls.removeEventListener("change", onControlsChange);
      controlsListening = false;
    }
    controls?.dispose();
    controls = null;
    renderer?.dispose();
    renderer = null;
    scene.remove(field.group);
  };

  try {
    renderer = new Renderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x0b0d10, 1);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    controls = new Controls(camera, canvas);
    controls.target.set(...DEFAULT_TARGET);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = false;
    controls.minPolarAngle = 0.85;
    controls.maxPolarAngle = 1.35;
    controls.minAzimuthAngle = AZIMUTH_RANGE[0];
    controls.maxAzimuthAngle = AZIMUTH_RANGE[1];
    controls.update();
  } catch (error) {
    disposed = true;
    releaseResources();
    throw error;
  }

  const render = () => {
    if (!disposed) {
      renderer.render(scene, camera);
    }
  };

  const resize = () => {
    if (disposed) {
      return;
    }
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    const halfWidth = 5 * (width / height);
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = 5;
    camera.bottom = -5;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  };

  const rotateBy = (direction) => {
    const step = Math.sign(Number(direction));
    if (!Number.isFinite(step) || step === 0 || disposed) {
      return false;
    }
    const spherical = new Spherical().setFromVector3(
      camera.position.clone().sub(controls.target),
    );
    spherical.theta = clamp(
      controls.getAzimuthalAngle() + step * (Math.PI / 12),
      AZIMUTH_RANGE[0],
      AZIMUTH_RANGE[1],
    );
    camera.position.copy(controls.target).add(new Vector3().setFromSpherical(spherical));
    camera.lookAt(controls.target);
    controls.update();
    render();
    return true;
  };

  const zoomBy = (direction) => {
    const step = Math.sign(Number(direction));
    if (!Number.isFinite(step) || step === 0 || disposed) {
      return false;
    }
    camera.zoom = clamp(
      camera.zoom * 1.15 ** step,
      ZOOM_RANGE[0],
      ZOOM_RANGE[1],
    );
    camera.updateProjectionMatrix();
    render();
    return true;
  };

  const resetView = () => {
    if (disposed) {
      return;
    }
    camera.position.set(...DEFAULT_POSITION);
    camera.zoom = 1;
    controls.target.set(...DEFAULT_TARGET);
    controls.update();
    camera.updateProjectionMatrix();
    render();
  };

  const onControlsChange = () => render();
  const onVisibilityChange = () => {
    if (documentRef.visibilityState === "visible") {
      render();
    }
  };
  controls.addEventListener("change", onControlsChange);
  controlsListening = true;
  documentRef.addEventListener("visibilitychange", onVisibilityChange);
  documentListening = true;
  try {
    resizeObserver = new ResizeObserverCtor(resize);
    resizeObserver.observe(container);
    resize();
  } catch (error) {
    disposed = true;
    releaseResources();
    throw error;
  }

  return Object.freeze({
    renderer,
    camera,
    controls,
    render,
    rotateBy,
    zoomBy,
    resetView,
    resize,
    dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      releaseResources();
    },
  });
}
