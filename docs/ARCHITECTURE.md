# Architecture

HelpRelay is a single-page static app with one deliberate seam: the same domain handler is called by a human UI rehearsal and by WebMCP `execute` functions.

```text
human controls ───────┐
                      ├─> src/tools.js ─> src/policy.js ─> in-memory session
document.modelContext ┘       │
                              └─> serializable result guard
```

## Modules

- `src/contracts.js` owns the five names, JSON Schemas, compact descriptions, annotations, canonicalization, digests, and result constructors.
- `src/session.js` owns local state transitions, evidence digesting, the separated brief payload, and replay records. It has no DOM or network dependency.
- `src/policy.js` validates closed inputs, current state, risk signals, allowlists, safe-step cardinality, brief equality, and human confirmation. It does not generate prose or mutate state.
- `src/tools.js` translates accepted requests into deterministic local state transitions and guards every result. It never calls a browser API or external service.
- `src/webmcp.js` statically registers exactly five definitions on `document.modelContext.registerTool`. It forwards WebMCP's `AbortController` signal and shares the handlers.
- `src/app.js` renders the accessible human rehearsal and synthetic story. It calls `tools.js`; the UI does not bypass policy. The story pauses on the exact handoff preview, and only its explicit confirmation button can mint the one-time human receipt.
- `scripts/serve.mjs` is an optional local-only static server using Node built-ins.

## State and revision model

Each session has a `sessionId`, monotonic `revision`, evidence array, and deterministic evidence digest. A state-changing understanding, evidence capture, safe-step proposal, brief preparation, or human confirmation receipt increments the revision. Handoff draft preparation is replay-safe and intentionally does not increment revision: repeating the exact request can return `duplicate-prepared` without creating a second side effect. If evidence changes, the stored handoff's evidence digest no longer permits a replay. The human UI receipt is one-time and is consumed when the draft is prepared.

## Trust boundaries

Page text, URLs, labels, user statements, model-produced reasons, and all tool inputs are untrusted. A brief labels visible text as untrusted and places interpretations and uncertainty in separate arrays. No model output is used as an instruction to open, send, buy, delete, configure, or operate a device.

## Browser support

The page remains usable without WebMCP. When `document.modelContext.registerTool` is unavailable, the adapter reports a local capability status and does not install a fallback or make a network request. Live tool execution remains a human-verification item.
