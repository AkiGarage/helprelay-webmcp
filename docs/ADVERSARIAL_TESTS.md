# Adversarial executable tests

Run with:

```sh
npm test
```

`tests/helprelay.test.js` exercises the public handler and registration seams. The cases are intentionally small and deterministic:

| Case | Expected boundary |
| --- | --- |
| Prompt injection | Instruction-like wording is risk-signaled; it cannot select a step. |
| Malicious page wording | Page content is captured as untrusted evidence and never followed. |
| Stale evidence | A changed evidence digest is blocked. |
| Mismatched session/revision/digest | Each stale envelope is blocked before mutation. |
| Suspicious link | Link-like input and a link-opening step are blocked. |
| Allowlist-external action | A URL target is rejected even when the step name looks safe. |
| Irreversible action | Delete/send/purchase-like step IDs are rejected. |
| Malformed input/output | Closed schemas and result serializability guard fail closed. |
| Unconfirmed handoff | `confirmed: false` and non-human confirmation are blocked. |
| Replay/duplicate semantics | Exact replay returns `duplicate-prepared`; changed payload and stale evidence fail. |
| Digest collision | Canonical destination/payload comparison rejects the `A trusted helper` / `E3JHq9` legacy digest collision. |
| Registration | A mocked `registerTool` receives exactly the five names and one shared signal; partial registration aborts and unregisters. |
| Forbidden operations | Device control, navigation/opening, purchase, settings/permissions, message/send, and deletion remain blocked. |
| Static serving | Dotfiles, `.git`, `.env`, non-allowlisted files, and symlink escapes are not served. |
| End-to-end story | Understand → evidence → block → safe step → brief → exact preview pause → explicit local draft confirmation. |

These are executable contract tests, not proof against every browser or model implementation. The live WebMCP environment and final public artifact remain unverified until a human owner observes them.
