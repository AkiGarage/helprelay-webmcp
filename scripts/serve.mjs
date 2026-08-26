import { createReadStream, realpathSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT_DIR = resolve(fileURLToPath(new URL("..", import.meta.url)));
export const PUBLIC_FILES = Object.freeze(new Set([
  "index.html",
  "styles.css",
  "src/app.js",
  "src/contracts.js",
  "src/policy.js",
  "src/session.js",
  "src/tools.js",
  "src/webmcp.js",
]));

const CONTENT_TYPES = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
});

function inside(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${sep}`);
}

/** Resolve only an allowlisted, real file below the public repository root. */
export function resolvePublicFile(urlPath, rootDir = ROOT_DIR) {
  try {
    const root = realpathSync(resolve(rootDir));
    const pathPart = decodeURIComponent((urlPath || "/").split("?")[0]);
    const relativePath = pathPart === "/" ? "index.html" : pathPart.replace(/^\/+/, "");
    const segments = relativePath.split(/[\\/]+/);
    if (segments.some((segment) => segment.startsWith("."))) return null;
    const candidate = resolve(root, relativePath);
    if (!inside(root, candidate)) return null;
    if (!PUBLIC_FILES.has(relativePath.replaceAll("\\", "/"))) return null;
    const realCandidate = realpathSync(candidate);
    if (realCandidate !== candidate) return null;
    if (!inside(root, realCandidate) || !statSync(realCandidate).isFile()) return null;
    return realCandidate;
  } catch {
    return null;
  }
}

export function handleStaticRequest(request, response, rootDir = ROOT_DIR) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, {
      allow: "GET, HEAD",
      "content-type": "text/plain; charset=utf-8",
    });
    response.end("Method not allowed");
    return;
  }

  const target = resolvePublicFile(request.url, rootDir);
  if (!target) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const contentType = CONTENT_TYPES[extname(target)] ?? "application/octet-stream";
  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": contentType,
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(target).on("error", () => response.destroy()).pipe(response);
}

export function createStaticServer(rootDir = ROOT_DIR) {
  return createServer((request, response) => handleStaticRequest(request, response, rootDir));
}

export function startServer(port = 4173, rootDir = ROOT_DIR) {
  const server = createStaticServer(rootDir);
  server.listen(port, "127.0.0.1", () => {
    console.log(`HelpRelay server listening on http://127.0.0.1:${port}`);
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const portIndex = args.indexOf("--port");
  const requestedPort = portIndex >= 0 ? Number(args[portIndex + 1]) : 4173;
  const port = Number.isInteger(requestedPort) && requestedPort > 0 && requestedPort < 65536
    ? requestedPort
    : 4173;
  startServer(port);
}
