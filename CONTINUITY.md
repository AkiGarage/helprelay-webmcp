# Continuity ledger

## Goal

Deliver the first public, dependency-free HelpRelay WebMCP Challenge implementation in this empty nested repository.

## Constraints

- Keep work inside this repository; preserve unrelated parent-workspace changes.
- No dependencies, install, API keys, storage, analytics, or application-side external mutation.
- Maintain two outcomes: bounded guidance or a human-confirmed trusted-helper draft.

## Decisions

- `src/policy.js` is independent and fail-closed.
- `src/tools.js` is the shared human/WebMCP domain seam.
- The live story calls the exact registered WebMCP `execute` functions; unavailable browsers use the same handler as a clearly labelled local fallback.
- `understand_problem` is the one-time, envelope-free bootstrap on a fresh session and returns the complete envelope required by later tools.
- The only accepted action is one symbolic `review_visible_context` view-only step.
- Handoff confirmation carries deterministic destination/payload digests plus canonical exact values and never sends.
- A human UI confirmation creates a one-time local receipt; WebMCP JSON cannot self-assert the receipt.

## Done

- Five tool contracts and static WebMCP registration adapter.
- In-memory session, evidence generation/digest binding, policy, output guard, human UI, synthetic story.
- Twenty-one built-in Node tests, local HTTP server/check scripts, one-time bootstrap, async registration failure deactivation, complete result envelopes, bounded arrays, and explicit human-preview flow.
- Required README, security/privacy/provenance and judge/submission documentation.
- Public repository, MIT license detection, GitHub Pages deployment, and exact public URL.
- Live WebMCP discovery and calls in Codex's supported in-app browser.
- Desktop and 390px responsive UI readbacks, including the separate handoff confirmation.

## Now / Next

- Keep the final repository revision aligned with the recorded tests and deployed artifact.
- Human owner records and publishes the required public video, accepts any legal/eligibility terms, and performs the final Devpost submission.

## Evidence boundary

Local tests prove deterministic repository behavior. Separate readbacks prove the recorded GitHub Pages artifact and live WebMCP execution on 2026-08-26. Neither proves real-user outcomes or safety in every situation.
