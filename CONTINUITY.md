# Continuity ledger

## Goal

Deliver the submission-quality “The Safe Relay” UI revision on `codex/submission-quality-ui`, based on `43df91735caba063c78c771834fb041af91e9185`, for owner hands-on review before video production.

## Constraints

- Keep work inside this repository; preserve unrelated parent-workspace changes.
- No dependencies, install, API keys, storage, analytics, or application-side external mutation.
- Maintain two outcomes: bounded guidance or a human-confirmed trusted-helper draft.
- Preserve all five WebMCP tools, deterministic policy, evidence binding, replay controls, and the 21-test baseline.
- Do not create the final video, update Devpost, submit, or merge `main` in this phase.

## Decisions

- `src/policy.js` is independent and fail-closed.
- `src/tools.js` is the shared human/WebMCP domain seam.
- The live story calls the exact registered WebMCP `execute` functions; unavailable browsers use the same handler as a clearly labelled local fallback.
- `understand_problem` is the one-time, envelope-free bootstrap on a fresh session and returns the complete envelope required by later tools.
- The only accepted action is one symbolic `review_visible_context` view-only step.
- Handoff confirmation carries deterministic destination/payload digests plus canonical exact values and never sends.
- A human UI confirmation creates a one-time local receipt; WebMCP JSON cannot self-assert the receipt.
- Concept A, “The Safe Relay,” is the visual authority. The unsafe route ends at policy; the allowlisted view-only route continues to a local Trusted Brief.
- The public preview may deploy the dedicated branch only after frozen local validation passes; `main` remains unchanged.

## Done

- Five tool contracts and static WebMCP registration adapter.
- In-memory session, evidence generation/digest binding, policy, output guard, human UI, synthetic story.
- Twenty-one built-in Node tests, local HTTP server/check scripts, one-time bootstrap, async registration failure deactivation, complete result envelopes, bounded arrays, and explicit human-preview flow.
- Required README, security/privacy/provenance and judge/submission documentation.
- Public repository, MIT license detection, GitHub Pages deployment, and exact public URL.
- Live WebMCP discovery and calls in Codex's supported in-app browser.
- Desktop and 390px responsive UI readbacks, including the separate handoff confirmation.
- Issue #22 and its latest owner comment, “Submission-quality revision required before YouTube upload,” re-read as the current specification.
- Base revision confirmed clean; dedicated worktree and branch created.
- Baseline `npm test` 21/21 and `npm run check` PASS.
- Two desktop/mobile ImageGen directions explored; Concept A selected and recorded in `docs/UI_CONCEPT_SPEC.md`.
- “The Safe Relay” implemented with the exact five-tool route, visible policy split, local Trusted Brief, exact destination channel, and separate human gate.
- 1920×1080 and 390×844 screenshots captured after browser QA; no horizontal overflow, 17px body copy, 14px tool/preview copy, and 60px mobile primary control.
- Reduced-motion behavior, local WebMCP discovery/call, story pause, explicit confirmation, and no-send state read back in the supported browser.
- Frozen local validation: `npm test` 21/21 and `npm run check` PASS.

## Now / Next

- Commit/push the dedicated branch, deploy and read back the Pages preview.
- Stop for owner hands-on UI review before any video or submission work; `main` remains unchanged.

## Evidence boundary

The baseline tests prove deterministic behavior at the base revision. New local and live evidence must be recorded against the final UI commit before claiming the redesign or preview is ready. Neither local nor live checks prove real-user outcomes or guaranteed safety.
