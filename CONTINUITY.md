# Continuity ledger

## Goal

Deliver the first public, dependency-free HelpRelay WebMCP Challenge implementation in this empty nested repository.

## Constraints

- Keep work inside this repository; preserve unrelated parent-workspace changes.
- No dependencies, install, network, API keys, storage, analytics, commit, push, deploy, or external mutation.
- Maintain two outcomes: bounded guidance or a human-confirmed trusted-helper draft.

## Decisions

- `src/policy.js` is independent and fail-closed.
- `src/tools.js` is the shared human/WebMCP domain seam.
- The only accepted action is one symbolic `review_visible_context` view-only step.
- Handoff confirmation carries deterministic destination/payload digests plus canonical exact values and never sends.
- A human UI confirmation creates a one-time local receipt; WebMCP JSON cannot self-assert the receipt.

## Done

- Five tool contracts and static WebMCP registration adapter.
- In-memory session, evidence digest, policy, output guard, human UI, synthetic story.
- Built-in Node tests, local HTTP server/check scripts, registration rollback, bounded arrays, and explicit human-preview flow.
- Required README, security/privacy/provenance and judge/submission documentation.

## Now / Next

- Run `npm test`, `npm run check`, local server + curl, and `git diff --check` / `git diff --cached --check`.
- Human owner must verify the exact browser environment, public deployment, recording, legal text, and final submission.

## Evidence boundary

Local test results prove deterministic repository behavior only. They do not prove live WebMCP support, GitHub Pages availability, real user research, or safety in all situations.
