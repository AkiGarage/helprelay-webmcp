# Adversarial executable tests

Run with:

```sh
npm test
```

`tests/helprelay.test.js` exercises the public handler and registration seams. The cases are intentionally small and deterministic:

| Case | Expected boundary |
| --- | --- |
| Prompt injection | Instruction-like wording is risk-signaled; it cannot select a step. |
| Session bootstrap | The first `understand_problem` returns the complete envelope; repeated or partial bootstrap attempts fail closed. |
| Malicious page wording | Page content is captured as untrusted evidence and never followed. |
| Stale evidence | Changed evidence generation or digest is blocked, including a known legacy 32-bit digest collision pair. |
| Mismatched session/revision/digest | Each stale envelope is blocked before mutation. |
| Suspicious link | Link-like input and a link-opening step are blocked. |
| Allowlist-external action | A URL target is rejected even when the step name looks safe. |
| Irreversible action | Delete/send/purchase-like step IDs are rejected. |
| Malformed input/output | Closed schemas and result serializability guard fail closed. |
| Unconfirmed handoff | `confirmed: false` and non-human confirmation are blocked. |
| Replay/duplicate semantics | Exact replay returns `duplicate-prepared`; changed payload, changed evidence, and a receipt issued before changed evidence fail. |
| Digest collisions | Evidence generation rejects a known evidence collision; canonical comparison rejects the `A trusted helper` / `E3JHq9` destination collision. |
| Registration | A mocked `registerTool` receives exactly five names and one shared signal; synchronous/async partial failures abort, unregister when possible, and deactivate residual executors. |
| Forbidden operations | Device control, navigation/opening, purchase, settings/permissions, message/send, and deletion remain blocked. |
| Static serving | Dotfiles, `.git`, `.env`, non-allowlisted files, external symlinks, and allowlisted-name symlinks to in-root secrets are not served. |
| End-to-end story | The exact registered executors run understand → evidence → block → safe step → brief → exact preview pause → explicit local draft confirmation. |

These are executable contract tests, not proof against every browser or model implementation. On 2026-08-26, the GitHub Pages artifact was separately exercised through live WebMCP in Codex's supported in-app browser; the exact readback is recorded in `docs/VERIFICATION_EVIDENCE.md`.
