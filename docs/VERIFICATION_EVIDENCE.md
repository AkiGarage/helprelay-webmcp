# Verification evidence

Recorded on 2026-08-26 against the public competition repository and live GitHub Pages deployment.

## Public artifact

- Repository: https://github.com/AkiGarage/helprelay-webmcp
- Live URL: https://akigarage.github.io/helprelay-webmcp/
- Initial application commit: `a6b9ac3eb7101e78b7048038a56e24d211f0d9bd`
- GitHub Pages reported the deployment as `built` with HTTPS enforced.
- Served `index.html` SHA-256: `5faaba4a2db29a9ed5380ae9576e06d3c06d3f2938400cbd5aa1b399b28f0b74`
- Served `src/app.js` SHA-256: `40870fdcda5ad7b4c88e4a63fd8d3c702a8fc50cb41197b8247cf6f557549d75`
- Both hashes matched the local application artifact exactly.

## Live WebMCP execution

Environment: Codex in-app browser, the supported WebMCP judge path.

The live page exposed exactly these tools through the browser's WebMCP capability:

1. `understand_problem`
2. `collect_evidence`
3. `propose_safe_step`
4. `prepare_trusted_brief`
5. `request_handoff`

Observed typed-call sequence:

- `understand_problem` → `problem-understood`
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
- The confirmation button remained enabled only at that review point.
- One separate click completed the local draft and disabled the receipt.
- Final status: `Story complete · the trusted brief is ready for review, and nothing was sent.`
- At 1280×720 and 390×844: no horizontal overflow, one `h1`, no unlabeled buttons, and a 64px minimum button height.

## Local executable evidence

- `npm test`: 17/17 pass.
- `npm run check`: syntax, required files, five definitions, registration seam, module entry, and no storage/network call in the HTML artifact.
- Local HTTP smoke: `/` returned the expected artifact; `/.env` and `/.git/config` returned 404.
- The server test also covers dotfiles, non-allowlisted files, and symlink escape denial.

## Evidence limits

This evidence does not claim guaranteed safety, measured real-user accessibility, user research, legal eligibility, a published YouTube video, or a completed Devpost submission.

Official challenge sources used for the submission boundary:

- https://openai.com/webmcp-challenge/
- https://webmcp.devpost.com/rules
