# One Calm Moment — selected UI concept

## Selection

`one-calm-moment-desktop.png` and `one-calm-moment-mobile.png` are the implementation authority for this revision. The direction was selected because it turns the first viewport from a technical storyboard into one calm, consumer-facing moment. The gaze path is vertical and singular: reassurance, one action, one safety decision, progress, then the local handoff preview.

Selected references:

- `docs/ui-concepts/one-calm-moment-desktop.png`
- `docs/ui-concepts/one-calm-moment-mobile.png`

Alternative retained for provenance:

- `docs/ui-concepts/calm-guided-room-alternative.png`

## Product promise

**When something online feels wrong, HelpRelay starts with what is already visible, stops the unsafe guess, and offers one view-only next step.**

The opening experience must communicate:

1. The person does not need to understand the technology before starting.
2. A suspicious synthetic page is treated as untrusted evidence.
3. Deterministic policy stops the unsafe path before any link or credential action.
4. Only one view-only, reversible step remains.
5. A Trusted Brief stays local until a separate human confirmation; nothing is sent.

## Human-factors decisions

- One dominant action and one dominant state scene; technical proof is progressive disclosure.
- The desktop gaze path is top-to-bottom. No branch connectors, crossing lines, or equal-weight card grid.
- The primary button changes label, depth, icon, and status immediately after activation.
- Progress is always visible as a plain-language sentence plus five semantic dots. Exact tool names remain one disclosure away.
- Blocked and safe states use color, icon, heading, and explanatory copy together; color never carries meaning alone.
- Main explanatory copy inherits the 18 px desktop / 17 px mobile body size; only compact labels and technical metadata may be smaller. Primary controls are at least 56 px tall; all touch targets are at least 48 px.
- Focus order follows visual order. Focus rings remain fully visible.
- Motion is short and stateful: press response, active-step pulse, and settled result. Nothing loops decoratively.
- `prefers-reduced-motion: reduce` renders the same final states without transforms or animation.

## Visual system

- Canvas: warm paper `#fbf8f2`, with white `#fffdfa` for the main working surface.
- Text: deep ink `#10213f`; muted ink `#5f6877`.
- Primary action: indigo `#344db3`; pressed `#263b94`.
- Safe: jade `#287a5c`, surface `#edf8f2`.
- Blocked: warm coral `#d8624a`, surface `#fff1ec`; never use an alarming red wall.
- Neutral proof: sand `#eee5d7`; hairline `#ded7cb`.
- Typeface: local readable system stack only; no remote font dependency.
- Radius: 16–28 px for contained tasks; pills only for compact statuses.
- Depth: soft contact shadows and subtle inset button response. No glassmorphism, neon, or generic SaaS card grid.

## Desktop composition — 1920 × 1080

- A centered app canvas, maximum 1,420 px wide, with a compact brand/status header.
- The intro is centered and limited to one headline, one sentence, one primary button, and one live status.
- The main scene is a single enclosing surface. The synthetic page stays visually subordinate on the left; the policy response is the foreground focus on the right.
- Coral `blocked` and jade `view-only` results are paired as one decision surface, not rendered as separate navigation choices.
- A compact summary directly under the scene shows current progress. Expanding it reveals the five exact WebMCP tool names and their live states.
- The Trusted Brief is a calm lower sheet. It shows local-only/no-send truth before the separate confirmation control.

## Mobile composition — 390 × 844

- The same visual order becomes a single column; it is not a scaled desktop grid.
- The primary action remains in the first viewport with its live status immediately below.
- The suspicious page establishes the current-state context; policy feedback follows as the foreground decision in the same vertical scene.
- Progress uses a sentence and five dots. Tool names remain available through the same disclosure.
- The Trusted Brief follows the current scene and never obscures the primary action.
- No horizontal overflow at 320, 375, or 390 px.

## Required DOM and behavior seams

The redesign preserves:

- `#run-story`, `#run-story-mobile`, `#webmcp-status`, `#story-status`, `#mobile-story-status`, `#event-log`
- `#relay-stage`, `.tool-route`, `#tool-progress-status`
- `#handoff-preview`, `#handoff-destination`, `#handoff-payload`, `#handoff-raw-payload`, `#confirm-handoff`, `#helper-preview-placeholder`
- `#problem-form`, `#problem-input`, `#human-status`
- exactly one `[data-step]` each for `understand`, `evidence`, `policy`, `blocked`, `safe`, `brief`, and `handoff`, each with `.step-state`
- the five tool contracts, independent policy, evidence binding, replay protection, separate human confirmation receipt, and no-send behavior.

## Above-the-fold copy contract

Japanese starts with `大丈夫。いま見えている画面から確かめます。` and `いっしょに確かめる`. English uses the same plain-language meaning. The first viewport may state the blocked action, the one view-only step, visible progress, local Trusted Brief, separate confirmation, and no-send boundary. Implementation and event detail stays in disclosures.
