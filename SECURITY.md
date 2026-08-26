# Security and safety boundaries

HelpRelay is a safety-oriented prototype, not a safety guarantee. Its central security property is that untrusted browser text and model prose cannot select an external or irreversible action.

## Enforcement

- `src/policy.js` is independent from the prose-facing handlers. It validates a closed JSON input shape before any state mutation.
- Every request must identify the current `sessionId`, integer `revision`, and exact `evidenceDigest`. Stale evidence, revisions, or sessions fail closed.
- Risk signals include prompt-injection wording, suspicious links, credential requests, urgency pressure, and external-action wording. Evidence can be recorded as untrusted context, but it cannot become an instruction.
- The only proposed action is `review_visible_context`, a single view-only and reversible step with no URL or target. A session cannot receive a second safe step.
- The policy rejects browser/device control, navigation, arbitrary links, credential entry, downloads, installation, purchases, payments, deletion, settings or permission changes, uploads, calls, and messages.
- `request_handoff` creates a local draft only. It requires a payload that exactly matches the prepared brief, an allowlisted symbolic destination, and a one-time receipt minted by the separate human UI confirmation seam whose canonical destination and payload values (with digests as a compact supplement) match. A model cannot mint that receipt by adding `source: "human-ui"` to its own JSON. It never sends.
- Exact handoff replay is idempotent and returns `duplicate-prepared`; a changed or evidence-stale replay fails closed.
- WebMCP results are passed through a serializability/output-shape guard. Unexpected handler errors become a generic blocked result.

## Threat model limits

This code does not inspect a real browser page, prove a source's identity, guarantee truthful evidence, or replace a trusted person or professional. A malicious browser, compromised runtime, vulnerable browser implementation, or unsafe human decision is outside this prototype's proof boundary. A deployment owner should re-run tests and inspect the exact production artifact before making public claims.

## Reporting

Do not include secrets, credentials, private keys, or real personal data in an issue or demo. For a security report, use the repository's human-maintained private reporting channel once one is configured; the public placeholder is not yet a live security contact.
