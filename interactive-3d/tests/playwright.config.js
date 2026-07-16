import { resolve } from "node:path";
import { defineConfig } from "@playwright/test";

const previewPort = Number.parseInt(process.env.PREVIEW_PORT ?? "4173", 10);
const browserChannel = process.env.PLAYWRIGHT_CHANNEL ?? "chrome";
const defaultEvidence = resolve(
  process.cwd(),
  "../.omo/evidence/interactive-3d-profile/playwright-default",
);
const outputDir = resolve(
  process.cwd(),
  process.env.PLAYWRIGHT_OUTPUT_DIR ?? `${defaultEvidence}/output`,
);
const reportFile = resolve(
  process.cwd(),
  process.env.PLAYWRIGHT_REPORT_FILE ?? `${defaultEvidence}/report.json`,
);

export default defineConfig({
  testDir: "./e2e",
  outputDir,
  reporter: [["json", { outputFile: reportFile }], ["list"]],
  use: {
    baseURL: `http://127.0.0.1:${previewPort}/choijungmua/`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chrome",
      testIgnore: /fallback\.spec\.js/,
      use: { channel: browserChannel },
    },
    {
      name: "no-webgl",
      testMatch: /fallback\.spec\.js/,
      use: {
        channel: browserChannel,
        launchOptions: { args: ["--disable-webgl"] },
      },
    },
  ],
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${previewPort} --strictPort`,
    url: `http://127.0.0.1:${previewPort}/choijungmua/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
