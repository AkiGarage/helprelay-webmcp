# Judge guide

## Exact path (under one minute)

1. Open the verified live URL or run `npm run serve -- --port 4173` and open the local URL.
2. Confirm the first viewport shows the red unsafe guess beside the green policy-blocked WebMCP path.
3. Click **Run the 15-second story**.
4. Watch the six visible steps: understand, collect untrusted evidence, block the suspicious guess, offer one view-only step, prepare a separated brief, and pause on the draft-only handoff preview.
5. Review the exact destination and brief payload, then click **Confirm this local draft**. This is the only action that mints the one-time human receipt and prepares a local draft; nothing is sent.
6. If supported, use ChatGPT's in-app browser or Chrome `149+` with the WebMCP flag to inspect the five registered tools. The page reports when the registration surface is unavailable.

## What to look for

- WebMCP is used as a direct, imperative tool seam rather than as a decorative label.
- The human remains in control: no automatic URL opening, credentials, payments, settings, permissions, deletion, device control, or sending.
- Browser text is explicitly untrusted, and the trusted brief separates facts, interpretations, uncertainty, and attempts.
- An exact replay is idempotent, while a changed or stale request closes safely.

## Fixed judging criteria and tie-break

This submission uses the challenge criteria in this fixed order:

1. **WebMCP Leverage** — whether the five tools make the safe collaboration seam useful to a browser agent.
2. **Execution** — whether the product is clear, runnable, accessible, and faithful to its boundaries.
3. **Potential Impact** — whether the pattern can help people who have low digital confidence without hiding risk.
4. **Creativity & Ambition** — whether the person, agent, and trusted helper are combined into a distinct, humane workflow.

If entries are otherwise tied, the tie-break prioritizes the criteria in that listed order.

## Evidence limits

The repository's tests verify deterministic local behavior. They do not verify live model execution, production hosting, measured accessibility, user research, or guaranteed safety. Those claims require human observation and sign-off.

## Supported environment

The intended live judge environment is ChatGPT in-app browser or Chrome `149+` with WebMCP enabled in that environment. A normal modern browser can run the human story even when WebMCP is unavailable.
