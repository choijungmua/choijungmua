import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const valueAfter = (flag, fallback) => {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : fallback;
};

const url = valueAfter("--url", "http://127.0.0.1:4173/choijungmua/");
const runs = Number.parseInt(valueAfter("--runs", "3"), 10);
const evidence = resolve(valueAfter("--evidence", "../.omo/evidence/lighthouse"));
const categories = ["performance", "accessibility", "best-practices", "seo"];
await mkdir(evidence, { recursive: true });

const results = [];
for (const formFactor of ["mobile", "desktop"]) {
  for (let run = 1; run <= runs; run += 1) {
    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless=new", "--disable-gpu", "--no-first-run"],
    });
    try {
      const response = await lighthouse(url, {
        port: chrome.port,
        output: ["json", "html"],
        logLevel: "error",
        formFactor,
        screenEmulation:
          formFactor === "mobile"
            ? { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false }
            : { mobile: false, width: 1280, height: 800, deviceScaleFactor: 1, disabled: false },
        throttlingMethod: "provided",
      });
      const [json, html] = response.report;
      await Promise.all([
        writeFile(`${evidence}/${formFactor}-${run}.json`, json),
        writeFile(`${evidence}/${formFactor}-${run}.html`, html),
      ]);
      const scores = Object.fromEntries(
        categories.map((category) => [
          category,
          response.lhr.categories[category].score,
        ]),
      );
      results.push({ formFactor, run, scores });
    } finally {
      try {
        await chrome.kill();
      } catch (error) {
        if (error?.code !== "EPERM") {
          throw error;
        }
      }
    }
  }
}

const medians = Object.fromEntries(
  ["mobile", "desktop"].map((formFactor) => [
    formFactor,
    Object.fromEntries(
      categories.map((category) => {
        const values = results
          .filter((result) => result.formFactor === formFactor)
          .map((result) => result.scores[category])
          .sort((a, b) => a - b);
        return [category, values[Math.floor(values.length / 2)]];
      }),
    ),
  ]),
);
await writeFile(
  `${evidence}/summary.json`,
  JSON.stringify({ url, runs, results, medians }, null, 2),
);

const failures = Object.entries(medians).flatMap(([formFactor, scores]) =>
  Object.entries(scores)
    .filter(([, score]) => score !== 1)
    .map(([category, score]) => `${formFactor}:${category}=${score}`),
);
if (failures.length) {
  console.error(`LIGHTHOUSE_FAIL ${failures.join(" ")}`);
  process.exit(1);
}
console.log("LIGHTHOUSE_PASS 1.00/1.00/1.00/1.00 mobile+desktop");
