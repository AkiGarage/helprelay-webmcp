# HelpRelay

HelpRelay is a small, dependency-free WebMCP Challenge prototype for a common browser moment: a person sees a frightening message, a browser agent can be tempted to guess, and a trusted person may eventually need a concise handoff.

The product keeps the human interface primary. Each screen asks for one decision, uses large controls, shows the current state, and keeps external effects behind a separate confirmation. The two valid outcomes are:

1. bounded, safety-checked guidance with at most one view-only, reversible step; or
2. a user-approved trusted-person handoff draft that is previewed locally and never sent by this app.

HelpRelay does not claim that guidance is guaranteed safe. Browser text, model prose, links, and user-provided wording are untrusted inputs. An independent deterministic policy validates the closed tool envelope, current session/revision/evidence digest, allowlists, and risk signals before a handler can change local demo state.

## What is here

- Five imperative WebMCP tools registered through `document.modelContext.registerTool(...)`:
  `understand_problem`, `collect_evidence`, `propose_safe_step`,
  `prepare_trusted_brief`, and `request_handoff`.
- A synthetic 15-second story: an urgent prompt-injection banner and suspicious link are captured as untrusted evidence; an unsafe guess is blocked; one safe view-only step is offered; a separated trusted brief is prepared; and the story pauses on an exact destination/payload preview until a separate human confirmation prepares the local draft.
- One domain handler used by both the human rehearsal UI and the WebMCP adapter.
- No framework, package dependency, API key, analytics, network call, browser storage, or build step.
- Built-in Node test and static-server scripts only.

## Run locally

Requirements: Node `>=22` and a browser that exposes WebMCP. A browser without WebMCP can still run the human rehearsal.

```sh
npm test
npm run check
npm run serve -- --port 4173
```

Then open `http://127.0.0.1:4173/`. The server is a local smoke-test helper implemented with Node's built-in `http` module; it makes no outbound request.

The live competition URL is intentionally a placeholder until a human owner verifies the final GitHub Pages deployment:

`[LIVE DEMO URL — human verification required]`

## WebMCP support

The intended judge path is ChatGPT's in-app browser or Chrome `149+` with the WebMCP flag available in that environment. API availability is detected at runtime. The app never treats “registered” as proof that a model actually executed a tool; execution should be observed in the supported judge environment.

The registration adapter passes an `AbortController` signal from WebMCP's execute context into the same local handlers used by the page. Every result is checked for a serializable `content` array and `structuredContent` before it crosses the seam. A handoff confirmation is minted only by the human UI seam as a one-time local receipt; a model cannot self-assert that receipt in tool JSON.

## Verification boundary

Verified in this repository:

- deterministic policy behavior for prompt injection, malicious wording, stale state, suspicious links, external targets, irreversible requests, malformed envelopes/results, unconfirmed handoff, replay, and duplicate preparation;
- registration of all five names against a mocked `registerTool`;
- a complete synthetic flow through the public handler seam;
- JavaScript syntax, required-file checks, and local HTTP serving when those commands are run by the owner.

Not verified by this repository alone:

- live browser/WebMCP implementation availability or model execution;
- accessibility outcomes with real users or measured user research;
- GitHub Pages deployment, public URL, screen recording, Devpost submission, or legal review;
- a guarantee that any guidance is safe in every real-world situation.

See [`docs/JUDGE_GUIDE.md`](docs/JUDGE_GUIDE.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), and [`docs/ADVERSARIAL_TESTS.md`](docs/ADVERSARIAL_TESTS.md) for the evidence and limits.

The fixed judging criteria are **WebMCP Leverage**, **Execution**, **Potential Impact**, and **Creativity & Ambition**, in that order. The same listed order is the tie-break priority.

## License

MIT. See [`LICENSE`](LICENSE).
