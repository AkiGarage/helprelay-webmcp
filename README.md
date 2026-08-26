# HelpRelay

HelpRelay is a small, dependency-free WebMCP Challenge prototype for a common browser moment: a person sees a frightening message, a browser agent can be tempted to guess, and a trusted person may eventually need a concise handoff.

The product keeps the human interface primary. Each screen asks for one decision, uses large controls, shows the current state, and keeps external effects behind a separate confirmation. The two valid outcomes are:

1. bounded, safety-checked guidance with at most one view-only, reversible step; or
2. a user-approved trusted-person handoff draft that is previewed locally and never sent by this app.

HelpRelay does not claim that guidance is guaranteed safe. Browser text, model prose, links, and user-provided wording are untrusted inputs. An independent deterministic policy validates the closed tool envelope, current session/revision/evidence generation and digest, allowlists, and risk signals before a handler can change local demo state.

## What is here

- Five imperative WebMCP tools registered through `document.modelContext.registerTool(...)`:
  `understand_problem`, `collect_evidence`, `propose_safe_step`,
  `prepare_trusted_brief`, and `request_handoff`.
- A synthetic 15-second story: an urgent prompt-injection banner and suspicious link are captured as untrusted evidence; an unsafe guess is blocked; one safe view-only step is offered; a separated trusted brief is prepared; and the story pauses on an exact destination/payload preview until a separate human confirmation prepares the local draft.
- One domain handler used by both surfaces. When WebMCP is present, the human story runs through the exact registered `execute` functions and labels that path in the visible log.
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

Live competition demo: **https://akigarage.github.io/helprelay-webmcp/**

Public source: **https://github.com/AkiGarage/helprelay-webmcp**

## WebMCP support

The intended judge path is ChatGPT's in-app browser or Chrome `149+` with the WebMCP flag available in that environment. API availability is detected at runtime. The app never treats “registered” as proof that a model actually executed a tool; execution should be observed in the supported judge environment.

The first `understand_problem` call safely bootstraps a fresh page session from only `userStatement` and returns the complete envelope required by every later typed call. Bootstrap is accepted once; a partial envelope or restart attempt fails closed. The registration adapter awaits every `registerTool` result, passes an `AbortController` signal into the same local handlers used by the page, and deactivates any residual partial surface if registration fails. Every result is checked for a serializable `content` array and `structuredContent` before it crosses the seam. A handoff confirmation is minted only by the human UI seam as a one-time local receipt bound to the current revision and evidence; a model cannot self-assert that receipt in tool JSON.

## Verification boundary

Verified on 2026-08-26:

- 21 executable tests covering one-time session bootstrap, prompt injection, malicious wording, stale state, complete result envelopes, evidence/destination digest collisions, suspicious links, external targets, irreversible requests, malformed envelopes/results, stale/unconfirmed handoff, replay, async registration rejection, and duplicate preparation;
- registration of all five names against a mocked `registerTool`;
- a complete synthetic flow through the exact registered WebMCP `execute` functions;
- JavaScript syntax, required-file checks, local HTTP serving, and denial of dotfiles, `.git`, `.env`, and symlink escapes;
- GitHub Pages serving the checked application artifact over HTTPS;
- all five tools discovered and called through live WebMCP in Codex's supported in-app browser, including an unsafe-step block and an unconfirmed-handoff block;
- the human story pausing on the exact preview before a separate confirmation, with nothing sent; and
- desktop and 390px responsive readbacks with no horizontal overflow, one `h1`, labelled controls, and 64px minimum button height.

Not claimed:

- accessibility outcomes with real users or measured user research;
- screen recording, YouTube publication, Devpost submission, eligibility, or legal review;
- a guarantee that any guidance is safe in every real-world situation.

See [`docs/VERIFICATION_EVIDENCE.md`](docs/VERIFICATION_EVIDENCE.md), [`docs/JUDGE_GUIDE.md`](docs/JUDGE_GUIDE.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), and [`docs/ADVERSARIAL_TESTS.md`](docs/ADVERSARIAL_TESTS.md) for the evidence and limits.

The judging criteria are equally weighted: **WebMCP Leverage**, **Execution**, **Potential Impact**, and **Creativity & Ambition**. The same listed order is the tie-break priority, so the demo makes the WebMCP advantage visible first.

## License

MIT. See [`LICENSE`](LICENSE).
