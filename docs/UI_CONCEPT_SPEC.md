# The Safe Relay — selected UI concept

## Selection

Concept A is the implementation authority. It makes WebMCP's advantage visible without developer language: a person's confusing browser moment enters a clearly named policy gate, the unsafe route stops in coral, one bounded route continues in jade, and a trusted helper receives only a local draft. Concept B's illustrated stepping-stone metaphor felt warmer, but it was more childlike and made the five typed tools less central.

Selected references:

- `docs/ui-concepts/concept-a-desktop-selected.png`
- `docs/ui-concepts/concept-a-mobile-selected.png`

Alternative explored:

- `docs/ui-concepts/concept-b-desktop.png`
- `docs/ui-concepts/concept-b-mobile.png`

## Product promise

**When something online feels wrong, HelpRelay helps you pause, understand it, and choose one safe next step.**

The opening view must communicate the whole relay in fifteen seconds or less:

1. A synthetic browser page asks for an urgent credential action.
2. Five real WebMCP tools pass the situation through deterministic policy.
3. The suspicious action stops; one view-only step remains.
4. A Trusted Brief is previewed locally and cannot progress without a separate human confirmation.
5. Nothing is sent.

## Visual system

- Canvas: true white `#ffffff`; secondary oat `#f7f2e9` only for calm grouping.
- Text: deep ink `#182033`; muted ink `#62697a`.
- Active route: cobalt `#2f66e8`.
- Unsafe route: coral `#e75b49`; never use alarming full-screen red.
- Safe route: jade `#258a62`.
- Lines: quiet gray `#dde1e8`; relay paths are 3–4 px with rounded ends.
- Typeface: local humanist/rounded system stack; no external font dependency.
- Body copy: minimum 17 px, line-height 1.55 or greater.
- Controls: minimum 52 px height, obvious focus ring, plain action language.
- Corners: restrained 14–24 px only where they communicate a contained moment or action.
- No glass, gradients, generic card grids, badge collections, large marketing hero, or dashboard chrome.

## Desktop composition — 1920 × 1080

- Compact top bar: HelpRelay wordmark, one-line promise, and real WebMCP connection status.
- One open relay stage, divided by hairlines rather than a wall of cards:
  - **You:** the synthetic suspicious page and the person's plain-language concern.
  - **Policy & AI:** exactly five typed WebMCP tools, including the split unsafe/safe result of `propose_safe_step`.
  - **Trusted helper:** the allowlisted view-only step, Trusted Brief preview, separate confirmation, and “Nothing has been sent.”
- A curved cobalt relay line carries attention left to right. Coral ends at the policy gate; jade continues to the local draft.
- One dominant action sits under the relay. Technical event output is a secondary disclosure.
- The core relay, action, reassurance, and handoff pause must fit in the first 1080 px.

## Mobile composition

- The same relay becomes one vertical route; it is not a shrunken desktop grid.
- Each phase is introduced once, followed immediately by the relevant content and action.
- Tool labels may wrap but remain fully readable.
- Controls span the available width and remain at least 52 px tall.
- The safe result and “Nothing has been sent” remain visible before technical details.

## Interaction and motion

- Running the story advances one tool at a time with a brief line pulse and state change.
- Pending, active, blocked, safe, and complete states use shape, copy, and color together.
- Motion duration stays between 180 and 420 ms; no parallax or decorative looping.
- Under `prefers-reduced-motion: reduce`, transitions and animations stop immediately and all state changes remain understandable.
- The story pauses at the exact handoff preview. The confirmation button creates a local receipt only; it never contacts a person.

## Required DOM and behavior seams

The redesign preserves:

- `#run-story`, `#webmcp-status`, `#story-status`, `#event-log`
- `#handoff-preview`, `#handoff-destination`, `#handoff-payload`, `#confirm-handoff`
- `#problem-form`, `#problem-input`, `#human-status`
- `[data-step="understand|evidence|blocked|safe|brief|handoff"]` and each `.step-state`
- the five tool contracts, independent policy evaluation, evidence binding, replay rules, and separate human-confirmation receipt.

## Above-the-fold copy contract

The first view may explain only the person's concern, the five tool names, the blocked unsafe route, the view-only safe route, the local Trusted Brief, separate confirmation, and that nothing was sent. Longer implementation and event details belong in the disclosure below the primary action.
