import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { parse } from "yaml";

const defaultWorkflowUrl = new URL("../../../.github/workflows/pages.yml", import.meta.url);
const workflowPath = process.env.WORKFLOW_FIXTURE ?? defaultWorkflowUrl;

test("deploys the Pages artifact with a pinned, least-privilege workflow", async () => {
  // Given: the production workflow or an explicitly supplied failure fixture.
  const workflow = parse(await readFile(workflowPath, "utf8"));

  // When: its release contract is projected into the machine-consumed fields.
  const build = workflow.jobs.build;
  const deploy = workflow.jobs.deploy;

  // Then: only the reviewed branch, tools, bytes, and permissions can deploy.
  assert.deepEqual(workflow.on, {
    push: { branches: ["main"] },
    workflow_dispatch: {},
  });
  assert.deepEqual(workflow.concurrency, {
    group: "pages",
    "cancel-in-progress": false,
  });
  assert.equal(Object.hasOwn(workflow, "permissions"), false);
  assert.deepEqual(Object.keys(workflow.jobs), ["build", "deploy"]);

  assert.equal(build["runs-on"], "ubuntu-24.04");
  assert.equal(build["timeout-minutes"], 15);
  assert.deepEqual(build.permissions, {
    contents: "read",
    pages: "read",
  });
  assert.deepEqual(build.steps, [
    {
      name: "Checkout source",
      uses: "actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0",
      with: { "persist-credentials": false },
    },
    {
      name: "Configure GitHub Pages",
      uses: "actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d",
    },
    {
      name: "Test and build in pinned Node",
      run: 'docker run --rm --user "$(id -u):$(id -g)" --volume "${{ github.workspace }}:/work:rw" --workdir /work/interactive-3d --env "HOME=/tmp" --env "npm_config_cache=/tmp/.npm" --env "VITE_BUILD_SHA=${{ github.sha }}" node:24.18.0-bookworm-slim@sha256:6f7b03f7c2c8e2e784dcf9295400527b9b1270fd37b7e9a7285cf83b6951452d sh -lc "npm ci && npm test && npm run check && npm run build && node tests/qa/dist-check.mjs dist /choijungmua/ 250 2048"',
    },
    {
      name: "Run browser release gates",
      run: 'docker run --rm --init --ipc=host --volume "${{ github.workspace }}:/work:rw" --workdir /work/interactive-3d --env "CI=true" --env "PLAYWRIGHT_CHANNEL=chromium" mcr.microsoft.com/playwright:v1.61.1-noble@sha256:5b8f294aff9041b7191c34a4bab3ac270157a28774d4b0660e9743297b697e48 sh -lc "npm run test:e2e"',
    },
    {
      name: "Upload Pages artifact",
      uses: "actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9",
      with: { path: "interactive-3d/dist" },
    },
  ]);

  assert.equal(deploy.needs, "build");
  assert.equal(deploy["runs-on"], "ubuntu-24.04");
  assert.equal(deploy["timeout-minutes"], 10);
  assert.deepEqual(deploy.permissions, {
    pages: "write",
    "id-token": "write",
  });
  assert.deepEqual(deploy.environment, {
    name: "github-pages",
    url: "${{ steps.deployment.outputs.page_url }}",
  });
  assert.deepEqual(deploy.steps, [
    {
      name: "Deploy GitHub Pages",
      id: "deployment",
      uses: "actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128",
    },
  ]);
});
