import assert from "node:assert/strict";

const paths = process.argv.slice(2);
const forbidden = [
  /(^|\/)\.omo\//,
  /(^|\/)(node_modules|dist|test-results|playwright-report)\//,
  /(^|\/)\.env($|\.)/,
  /(^|\/)(id_rsa|credentials|secrets?)(\.|$)/i,
];

for (const path of paths) {
  assert.ok(
    forbidden.every((pattern) => !pattern.test(path)),
    `Forbidden staged path: ${path}`,
  );
}

console.log("STAGING_GUARD_PASS");
