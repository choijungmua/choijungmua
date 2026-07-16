import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { createGzip } from "node:zlib";

const [distPath = "dist", expectedBase = "/choijungmua/"] = process.argv.slice(2);
const budgetKb = Number.parseInt(process.argv[4] ?? "250", 10);
const totalBudgetKb = Number.parseInt(process.argv[5] ?? "2048", 10);

async function filesUnder(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const child = `${path}/${entry.name}`;
      return entry.isDirectory() ? filesUnder(child) : [child];
    }),
  );
  return nested.flat();
}

async function gzipSize(path) {
  let bytes = 0;
  await new Promise((resolve, reject) => {
    createReadStream(path)
      .pipe(createGzip())
      .on("data", (chunk) => {
        bytes += chunk.length;
      })
      .on("end", resolve)
      .on("error", reject);
  });
  return bytes;
}

const files = await filesUnder(distPath);
const index = await readFile(`${distPath}/index.html`, "utf8");
const totalBytes = (
  await Promise.all(files.map(async (path) => (await stat(path)).size))
).reduce((sum, size) => sum + size, 0);
const javascript = files.filter((path) => path.endsWith(".js"));
const javascriptGzip = (
  await Promise.all(javascript.map((path) => gzipSize(path)))
).reduce((sum, size) => sum + size, 0);

assert.ok(index.includes(expectedBase));
assert.ok(!index.includes('src="/assets/'));
assert.ok(!index.includes('href="/assets/'));
assert.ok(javascriptGzip <= budgetKb * 1024);
assert.ok(totalBytes <= totalBudgetKb * 1024);

console.log(
  JSON.stringify({
    result: "DIST_CHECK_PASS",
    files: files.length,
    javascriptGzip,
    totalBytes,
  }),
);
