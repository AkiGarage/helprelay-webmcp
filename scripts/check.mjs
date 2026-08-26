import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "index.html",
  "styles.css",
  "src/contracts.js",
  "src/policy.js",
  "src/session.js",
  "src/tools.js",
  "src/webmcp.js",
  "src/app.js",
  "package.json",
  "README.md",
  "LICENSE",
  "PREEXISTING_VS_NEW.md",
  "SECURITY.md",
  "PRIVACY.md",
  "CONTINUITY.md",
  "docs/ARCHITECTURE.md",
  "docs/ADVERSARIAL_TESTS.md",
  "docs/JUDGE_GUIDE.md",
  "docs/DEVPOST_SUBMISSION.md",
  "docs/VIDEO_SCRIPT.md",
  "docs/SUBMISSION_CHECKLIST.md",
];

const codeFiles = [
  "src/contracts.js",
  "src/policy.js",
  "src/session.js",
  "src/tools.js",
  "src/webmcp.js",
  "src/app.js",
  "scripts/check.mjs",
  "scripts/serve.mjs",
];

const missing = requiredFiles.filter((file) => !existsSync(resolve(root, file)));
if (missing.length > 0) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

for (const file of codeFiles) {
  execFileSync(process.execPath, ["--check", resolve(root, file)], { stdio: "inherit" });
}

const html = readFileSync(resolve(root, "index.html"), "utf8");
const definitions = readFileSync(resolve(root, "src/contracts.js"), "utf8");
const webmcp = readFileSync(resolve(root, "src/webmcp.js"), "utf8");
const requiredNames = [
  "understand_problem",
  "collect_evidence",
  "propose_safe_step",
  "prepare_trusted_brief",
  "request_handoff",
];
for (const name of requiredNames) {
  if (!definitions.includes(`name: "${name}"`)) {
    console.error(`Missing WebMCP definition: ${name}`);
    process.exit(1);
  }
}
if (!webmcp.includes("registerTool")) {
  console.error("WebMCP registerTool seam is missing");
  process.exit(1);
}
if (!html.includes('type="module"')) {
  console.error("index.html must load an ES module");
  process.exit(1);
}
if (html.includes("fetch(") || html.includes("localStorage") || html.includes("sessionStorage")) {
  console.error("The static prototype must not call network or browser storage APIs");
  process.exit(1);
}

console.log(`check: PASS (${requiredFiles.length} required files, ${codeFiles.length} JavaScript modules)`);
