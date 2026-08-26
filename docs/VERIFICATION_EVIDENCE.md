# Verification evidence

Recorded on 2026-08-26 against the public competition repository and live GitHub Pages deployment.

## Public artifact

- Repository: https://github.com/AkiGarage/helprelay-webmcp
- Live URL: https://akigarage.github.io/helprelay-webmcp/
- Initial application commit: `a6b9ac3eb7101e78b7048038a56e24d211f0d9bd`
- GitHub Pages reported the deployment as `built` with HTTPS enforced.
- Served `index.html` SHA-256: `bf5a28a348f2233bab6235e0fe712cc2a61a8f7bca13644f0e9a54bf7d43e28c`
- Served `src/app.js` SHA-256: `2cec84e25aea4a45f5bea092fcfecd758ff5ab03f7f732a0ad776ce4106e3e8c`
- Public application manifest SHA-256: `cd03869dbbb1a749ae491b99a07ce0b573a8e9bc1757137c80201e6af5fe619d`
- The served hashes matched the local application artifact exactly.

## Live WebMCP execution

Environment: Codex in-app browser, the supported WebMCP judge path.

The live page exposed exactly these tools through the browser's WebMCP capability:

1. `understand_problem`
2. `collect_evidence`
3. `propose_safe_step`
4. `prepare_trusted_brief`
5. `request_handoff`

Observed typed-call sequence:

- `understand_problem` with only `userStatement` → `problem-understood` plus the complete session envelope
- `collect_evidence` with synthetic hostile wording → `evidence-captured`, with `prompt-injection`, `suspicious-link`, and `urgent-pressure` risk signals
- `propose_safe_step` requesting suspicious-link navigation → blocked as `unsafe-step`
- `propose_safe_step` requesting `review_visible_context` → `safe-step-offered`, `view-only`, reversible
- `prepare_trusted_brief` → `brief-prepared`, with facts, interpretations, uncertainty, and attempts kept separate
- `request_handoff` without a UI-minted receipt → blocked as `handoff-confirmation-required`
- a stale evidence digest → blocked as `evidence-stale`

This verifies real registration and execution in the recorded environment, not only a mocked `registerTool` test.

## Human-interface readback

- The page reported `WebMCP connected · 5 tools ready`.
- The 15-second story paused on the exact destination and brief preview.
- Its visible event log identified every domain call as `WebMCP tool`, and the story test executes those exact registered functions.
- The confirmation button remained enabled only at that review point.
- One separate click completed the local draft and disabled the receipt.
- Final status: `Story complete · the trusted brief is ready for review, and nothing was sent.`
- At 1280×720 and 390×844: no horizontal overflow, one `h1`, no unlabeled buttons, and a 64px minimum button height.

## Local executable evidence

- `npm test`: 21/21 pass.
- `npm run check`: syntax, required files, five definitions, registration seam, one cache-versioned public module graph, module entry, and no storage/network call in the HTML artifact.
- Local HTTP smoke: `/` returned the expected artifact; `/.env` and `/.git/config` returned 404.
- Regression cases include known evidence and destination digest collisions, evidence changed after human confirmation, rejected asynchronous registration with residual executor deactivation, and allowlisted-name symlinks targeting an in-root secret.
- The server test also covers dotfiles, non-allowlisted files, and internal/external symlink denial.

## Evidence limits

This evidence does not claim guaranteed safety, measured real-user accessibility, user research, legal eligibility, a published YouTube video, or a completed Devpost submission.

Official challenge sources used for the submission boundary:

- https://openai.com/webmcp-challenge/
- https://webmcp.devpost.com/rules
