# Judge guide

## Exact path (under one minute)

1. Open **https://akigarage.github.io/helprelay-webmcp/**.
2. Confirm the first viewport shows the red unsafe guess beside the green policy-blocked WebMCP path.
3. Click **Run the 15-second story**.
4. Watch the six visible steps: understand, collect untrusted evidence, block the suspicious guess, offer one view-only step, prepare a separated brief, and pause on the draft-only handoff preview.
   The event log prefixes each live step with **WebMCP tool**, proving the story uses the registered executor path rather than a separate UI-only simulation.
5. Review the exact destination and brief payload, then click **Confirm this local draft**. This is the only action that mints the one-time human receipt and prepares a local draft; nothing is sent.
6. Reload the page for a fresh agent session. In ChatGPT's in-app browser or Chrome `149+` with WebMCP enabled, call `understand_problem` with only `userStatement`, then carry its returned envelope into the later tools. Try `propose_safe_step` with a suspicious-link action or `request_handoff` without the UI-minted receipt; both close safely.

## What to look for

- WebMCP is used as a direct, imperative tool seam rather than as a decorative label.
- The human remains in control: no automatic URL opening, credentials, payments, settings, permissions, deletion, device control, or sending.
- Browser text is explicitly untrusted, and the trusted brief separates facts, interpretations, uncertainty, and attempts.
- An exact replay is idempotent, while a changed or stale request closes safely.

## Fixed judging criteria and tie-break

The four challenge criteria are equally weighted. This submission presents them in the official tie-break order:

1. **WebMCP Leverage** — whether the five tools make the safe collaboration seam useful to a browser agent.
2. **Execution** — whether the product is clear, runnable, accessible, and faithful to its boundaries.
3. **Potential Impact** — whether the pattern can help people who have low digital confidence without hiding risk.
4. **Creativity & Ambition** — whether the person, agent, and trusted helper are combined into a distinct, humane workflow.

If entries are otherwise tied, the tie-break prioritizes the criteria in that listed order.

## Evidence limits

The repository's tests verify deterministic behavior. A separate 2026-08-26 run verified the deployed artifact, tool discovery and execution in Codex's supported in-app browser, and responsive UI readbacks. This does not establish measured accessibility, user research, or guaranteed safety.

## Supported environment

The intended live judge environment is ChatGPT in-app browser or Chrome `149+` with WebMCP enabled in that environment. A normal modern browser can run the human story even when WebMCP is unavailable.
