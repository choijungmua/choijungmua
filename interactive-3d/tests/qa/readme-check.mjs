import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const path = process.argv[2] ?? "../README.md";
const markdown = await readFile(path, "utf8");
const target = "https://choijungmua.github.io/choijungmua/";
const matches = markdown.match(new RegExp(target.replaceAll("/", "\\/"), "g")) ?? [];

assert.equal(matches.length, 2);
assert.ok(markdown.indexOf("Launch the interactive 3D system") < markdown.indexOf("## Selected work"));
assert.match(markdown, /Spatial 3D is a pre-rendered vector study/);
assert.match(markdown, /Open the real-time Spatial 3D study/);
assert.doesNotMatch(markdown, /<script|<canvas|<iframe/i);

console.log("README_CHECK_PASS");
