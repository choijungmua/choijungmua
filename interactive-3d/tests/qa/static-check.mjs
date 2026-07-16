import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const [html, css, main, field, vite] = await Promise.all([
  read("index.html"),
  read("src/styles.css"),
  read("src/main.js"),
  read("src/scene/create-system-field.js"),
  read("vite.config.js"),
]);

assert.match(html, /<html lang="en">/);
assert.match(html, /id="layer-interface"[\s\S]*checked/);
assert.match(html, /aria-hidden="true"[\s\S]*tabindex="-1"/);
assert.match(html, /meta name="build-sha" content="%VITE_BUILD_SHA%"/);
assert.match(html, /https:\/\/choijungmua\.github\.io\/choijungmua\//);
assert.doesNotMatch(html, /aria-pressed|<iframe|https?:\/\/.*\.(woff|ttf)/i);
assert.match(css, /min-height: var\(--control-target\)/);
assert.match(css, /touch-action: pan-y pinch-zoom/);
assert.doesNotMatch(css, /linear-gradient|radial-gradient|box-shadow|backdrop-filter/);
assert.doesNotMatch(main, /requestAnimationFrame|setAnimationLoop|preventDefault\(\).*wheel/s);
assert.match(field, /side: BackSide/);
assert.match(vite, /base: "\/choijungmua\/"/);
assert.equal((await stat(new URL("public/assets/hero-spatial.svg", root))).isFile(), true);

console.log("STATIC_CHECK_PASS");
