import { createHash } from "node:crypto";
import { lstat, readFile, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const repository = resolve(process.argv[2] ?? "..");
const manifestFlag = process.argv.indexOf("--manifest");
const manifestPath =
  manifestFlag >= 0 ? resolve(process.argv[manifestFlag + 1]) : null;
const allowedRoots = [
  ".gitattributes",
  ".gitignore",
  ".github/workflows/pages.yml",
  "DESIGN.md",
  "README.md",
  "interactive-3d/",
];
const generated = /(^|\/)(node_modules|dist|\.vite|coverage|test-results|playwright-report)(\/|$)/;
const output = execFileSync(
  "git",
  ["ls-files", "-co", "--exclude-standard"],
  { cwd: repository, encoding: "utf8" },
);
const paths = output
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((path) => allowedRoots.some((root) => path === root || path.startsWith(root)))
  .filter((path) => !generated.test(path))
  .sort();

const entries = await Promise.all(
  paths.map(async (path) => {
    const absolute = resolve(repository, path);
    const [metadata, bytes] = await Promise.all([lstat(absolute), readFile(absolute)]);
    return {
      path: relative(repository, absolute).replaceAll("\\", "/"),
      mode: metadata.mode & 0o111 ? "100755" : "100644",
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    };
  }),
);
const canonical = `${JSON.stringify(entries)}\n`;
const sourceId = `working-${createHash("sha256").update(canonical).digest("hex").slice(0, 16)}`;
if (manifestPath) {
  await writeFile(manifestPath, JSON.stringify({ sourceId, entries }, null, 2));
}
console.log(sourceId);
