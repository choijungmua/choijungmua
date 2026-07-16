const UNAVAILABLE =
  "Interactive 3D unavailable. Layer details remain available.";

export function createLifecycle(elements, createRuntime) {
  const {
    app,
    canvas,
    poster,
    viewControls,
    retry,
    status,
    checkedRadio,
  } = elements;

  let runtime = null;
  let disposed = false;
  let restorationAllowed = false;

  const setState = (state) => {
    app.dataset.lifecycle = state;
  };

  const showPoster = () => {
    poster.hidden = false;
    canvas.hidden = true;
    viewControls.hidden = true;
  };

  const focusRadioBeforeHiding = (container) => {
    if (container.contains(document.activeElement)) {
      checkedRadio().focus();
    }
  };

  const releaseRuntime = () => {
    runtime?.dispose();
    runtime = null;
  };

  const unavailable = () => {
    focusRadioBeforeHiding(viewControls);
    releaseRuntime();
    showPoster();
    retry.hidden = false;
    status.textContent = UNAVAILABLE;
    setState("unavailable");
  };

  const attempt = (reason) => {
    if (disposed) {
      return false;
    }
    setState(reason === "initial" ? "initializing" : "restoring");
    if (reason !== "initial") {
      status.textContent = "Restoring interactive 3D.";
    }
    try {
      runtime = createRuntime();
      runtime.render();
      poster.hidden = true;
      canvas.hidden = false;
      viewControls.hidden = false;
      if (document.activeElement === retry) {
        checkedRadio().focus();
      }
      retry.hidden = true;
      setState("ready");
      if (reason !== "initial") {
        status.textContent = "Interactive 3D restored.";
      }
      return true;
    } catch {
      unavailable();
      return false;
    }
  };

  const onContextLost = (event) => {
    event.preventDefault();
    restorationAllowed = true;
    unavailable();
  };

  const onContextRestored = () => {
    if (!restorationAllowed || disposed) {
      return;
    }
    restorationAllowed = false;
    attempt("restore");
  };

  const onRetry = () => attempt("retry");
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  retry.addEventListener("click", onRetry);

  return Object.freeze({
    start() {
      return attempt("initial");
    },
    get runtime() {
      return runtime;
    },
    dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      releaseRuntime();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      retry.removeEventListener("click", onRetry);
      showPoster();
      retry.hidden = true;
      status.textContent = "";
      setState("disposed");
    },
  });
}
