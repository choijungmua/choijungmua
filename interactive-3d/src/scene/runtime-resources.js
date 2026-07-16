export function createRuntimeResources({
  createField,
  createScene,
  bindInput,
  initialLayer,
  onDispose = () => {},
}) {
  const field = createField();
  let scene = null;
  let releaseInput = null;
  let disposed = false;

  try {
    scene = createScene(field);
    releaseInput = bindInput({ field, scene });
    field.selectLayer(initialLayer);
    scene.render();
  } catch (error) {
    releaseInput?.();
    scene?.dispose();
    field.dispose();
    throw error;
  }

  const runtime = {
    field,
    scene,
    render: scene.render,
    dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      releaseInput();
      scene.dispose();
      field.dispose();
      onDispose(runtime);
    },
  };
  return Object.freeze(runtime);
}
