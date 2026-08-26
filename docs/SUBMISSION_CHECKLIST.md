# Submission checklist

## Repository and local evidence

- [x] Run `npm test` and retain the result: 21/21 pass.
- [x] Run `npm run check` and retain the result.
- [x] Run local HTTP server and verify the exact artifact plus denied `.env` and `.git` paths.
- [x] Run `git diff --check` and inspect the complete implementation diff.
- [x] Confirm no secrets, real PII, real links, dependencies, storage, analytics, or application outbound calls are present.
- [x] Verify the five exact WebMCP names and registration seam in the final artifact.
- [x] Verify Promise rejection, residual-executor deactivation, evidence collision, stale confirmation, and in-root secret symlink regressions.

## Human verification gates

- [x] Observe Codex's supported in-app browser discovering and executing all five WebMCP tools.
- [x] Verify https://akigarage.github.io/helprelay-webmcp/ and match the served application hashes to the repository artifact.
- [x] Check desktop and 390px responsive readbacks, labelled controls, explicit preview/confirmation, and no horizontal overflow.
- [ ] Human records the video and checks the first 15 seconds against `docs/VIDEO_SCRIPT.md`.
- [ ] Human reviews eligibility, legal language, and any Devpost required fields.
- [ ] Human adds the final video URL; repository and live demo URLs are complete.
- [ ] Human completes YouTube upload and any YouTube visibility/legal acknowledgement.
- [ ] Human reviews and submits Devpost.

YouTube publication, Devpost eligibility/legal review, and final submission remain human-only. This checklist does not authorize those actions.
