# Quiet Companion — selected UI concept

## Selection

`Quiet Companion` is the implementation authority for this revision. The finished direction is a warm, present companion rather than a waiting-room interface: it acknowledges fear, points to one next action, keeps the task in one stable place, explains what it is doing in ordinary language, then stops for the person again.

Selected references:

- `docs/ui-concepts/quiet-companion-concept-a.png`
- `docs/ui-concepts/quiet-companion-desktop-initial.png`
- `docs/ui-concepts/quiet-companion-desktop-result.png`
- `docs/ui-concepts/quiet-companion-mobile-initial.png`

Alternative retained for provenance:

- `docs/ui-concepts/calm-conversation-concept-b.png`

## Product promise

**When an online message feels wrong, HelpRelay checks only what is already visible, stops an unsafe action, and helps the person decide whether to stop or prepare a local note for someone they trust.**

The person should understand without knowing AI, WebMCP, policy, or developer terminology:

1. Nothing happens until they press one large button.
2. The app stays on the same screen while each check is explained.
3. A risky link is stopped before it opens.
4. The only suggested step is view-only and reversible.
5. Preparing a help note is a second decision.
6. Confirming that local draft is a third decision; nothing is sent externally.

## Human-factors decisions

- One question or decision per state. No dashboard and no simultaneous branches.
- The gaze path is vertical: reassurance, current problem, one action, visible progress, result, optional help note.
- The working surface keeps a stable position and scrolls into view after an intentional press, so progress never happens out of sight.
- Normal progress lasts long enough to read: roughly 1.65–1.9 seconds per plain-language stage. The current action remains large and centered while it runs.
- The three promises—no link opening, no input or purchase, and no sending without the person—are always visible. Only exact tool names and raw technical evidence remain in disclosures.
- Coral means “stopped” without an alarm wall. Jade means “view-only”. Icons and sentences duplicate color meaning.
- Body copy is 17 px on mobile and 18 px on desktop. Main controls are at least 61 px high on mobile. Result and brief copy is never reduced to technical-caption sizing.
- Motion is limited to press response, progress ring/dots, and state changes. `prefers-reduced-motion: reduce` removes animation and smooth scrolling while preserving the same information.

## Visual system

- Canvas: warm ivory with apricot and pale jade light; working surfaces stay bright enough for high-contrast reading.
- Text: deep navy for calm contrast; muted slate only for secondary reassurance.
- Primary action: restrained cobalt gradient with a single soft contact shadow.
- Stopped action: warm coral; safe result: jade.
- Typeface: local system Japanese sans-serif stack; no remote font or third-party visual asset.
- Radius: 14–28 px where it softens one contained task. The three safety promises form one supporting strip, not a dashboard grid.
- Depth: one dominant working surface, soft paper-like shadows, and two quiet color blooms; no glass, neon, or admin-panel chrome.

## Responsive composition

### Desktop — 1920 × 1080

- Centered 880 px working column inside a quiet header and white canvas.
- Headline, three-stage journey, current task, one action, and plain-language safety status fit in one gaze path.
- Unsafe and safe results share one decision surface. The primary next choice is centered below them.
- Five exact WebMCP tools remain inspectable in a collapsed disclosure.

### Mobile — 390 × 844

- The same state replaces the same working surface; there is no scaled desktop grid.
- A press scrolls the active surface into view, keeping the progress message, safety result, and later handoff preview visible.
- Controls remain finger-sized and there is no horizontal overflow at 320 or 390 px.
- The help note is reviewed as readable Japanese sections before the separate confirmation control.

## Preserved seams and safety boundary

The redesign preserves all existing DOM seams used by the tests, the five exact tool contracts, deterministic policy, evidence binding, replay protection, separate human confirmation receipt, and no-send behavior. The five tools remain `understand_problem`, `collect_evidence`, `propose_safe_step`, `prepare_trusted_brief`, and `request_handoff`.
