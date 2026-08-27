# Calm Guided Focus — selected UI concept

## Selection

The desktop revision in `desktop-revision-selected.png` is the implementation authority. It keeps the person's confusing browser moment beside one dominant safety decision, then places the five-tool execution proof and the local Trusted Brief on a quieter second tier. This removes the prototype-like three-column storyboard and crossing branch lines while preserving the complete WebMCP story.

Selected reference:

- `docs/ui-concepts/desktop-revision-selected.png`

Earlier alternatives retained for provenance:

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
- Lines: quiet gray `#dde1e8`; separators show grouping, never branching paths over content.
- Typeface: local humanist/rounded system stack; no external font dependency.
- Body copy: minimum 17 px, line-height 1.55 or greater.
- Controls: minimum 52 px height, obvious focus ring, plain action language.
- Corners: restrained 14–24 px only where they communicate a contained moment or action.
- No glass, gradients, generic card grids, badge collections, large marketing hero, or dashboard chrome.

## Desktop composition — 1920 × 1080

- Compact top bar: HelpRelay wordmark, one-line promise, and real WebMCP connection status.
- A two-tier reading order replaces the equal three-column storyboard:
  - **Primary tier:** the synthetic suspicious page beside one dominant safety decision. Coral stops the unsafe action; jade identifies the single view-only step.
  - **Proof tier:** the five exact WebMCP tools form a compact execution rail; the Trusted Brief sits beside it as a local draft with a separate confirmation.
- No branch line crosses copy or competes with the decision surfaces.
- One dominant action sits beside the opening promise, inside the first viewport. Technical event output is a secondary disclosure.
- The core relay, action, reassurance, and handoff pause must fit in the first 1080 px.

## Mobile composition

- The same relay becomes one vertical route; it is not a shrunken desktop grid.
- Each phase is introduced once, followed immediately by the relevant content and action.
- Tool labels may wrap but remain fully readable.
- Controls span the available width and remain at least 52 px tall.
- The safe result and “Nothing has been sent” remain visible before technical details.

## Interaction and motion

- Running the story advances one tool at a time through restrained state changes.
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
