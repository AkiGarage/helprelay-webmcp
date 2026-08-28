# UI fidelity ledger — One Calm Moment

Implementation reference: `docs/UI_CONCEPT_SPEC.md`

Selected visual references:

- `docs/ui-concepts/one-calm-moment-desktop.png`
- `docs/ui-concepts/one-calm-moment-mobile.png`

## Concept-to-code comparison

| Concept promise | Implemented evidence | Result |
| --- | --- | --- |
| One vertical gaze path instead of a dashboard | The opening moves from reassurance, to one primary action, to one enclosed safety scene, to the local brief | Match |
| Pressing the main action must feel immediate | The label changes to `Checking…` / `安全チェックを進めています…`, the status becomes indigo, and the active tool and progress sentence update within the first rendered step | Match |
| Unsafe and safe paths are understood without tracing lines | The same policy surface places a coral stopped action beside a jade view-only step; no connector diagram is used | Match |
| Independent policy is more prominent than AI prose | The policy heading, stopped action, view-only action, and explicit policy reassurance are the foreground of the main scene | Match |
| Real WebMCP remains provable but does not dominate | A compact disclosure shows the progress sentence and five dots; opening it reveals all five exact registered tool names and their states | Match |
| Human confirmation is visibly separate from preparation | The Trusted Brief previews destination and content, pauses before `request_handoff`, and enables a separate confirmation button | Match |
| No external message is implied | The preview heading, confirmation note, completion status, and persistent lock message all say that the result is a local draft and nothing was sent | Match |
| Large, tactile, readable controls | The primary action is 64–68 px high, confirmation is 58–60 px high, body text is 17–18 px, and press/focus states are explicit | Match |
| Mobile follows the same calm order | At 390 px the action appears before the scene, safety cards stack, the brief follows as the next visible section, and there is no horizontal overflow | Match |
| Motion supports state recognition without excluding reduced-motion users | Normal mode uses restrained press, pulse, and state transitions; `prefers-reduced-motion: reduce` resolves tested animations and transitions to `0.00001s` | Match |

## Intentional deviations

- The implementation uses a code-native line-and-heart brand mark instead of the image concept's decorative flourish so it stays sharp without third-party assets.
- The concept shows policy cards floating over a dimmed browser. The implementation keeps the browser context and policy in one bordered scene on desktop, which preserves readable synthetic evidence and avoids a modal impression.
- The exact WebMCP tool names are behind a disclosure rather than shown inline at all times. This keeps the consumer path calm while preserving inspectable technical proof.
- The full Trusted Brief remains available in a bounded, scrollable text area so the confirmation and no-send statement stay in the same 1920×1080 view.

## Above-the-fold copy diff

Removed from the prior prototype-style opening:

- challenge and technical-demo framing
- competing feature cards and numbered workflow blocks
- repeated explanations before the first action

Replaced with:

- `You’re okay. We’ll start with what’s on this screen.`
- `大丈夫。いま見えている画面から確かめます。`
- one conversational sentence, one tactile action, and one visible reassurance that the practice flow has no external effect

## Agency signoff

The implemented Japanese view was compared directly with both selected concept images at 1920×1080 and 390×844. Final QA confirmed one dominant entry action, immediate running feedback, a completed third policy step rather than a permanently gray state, visible coral/jade outcomes, five real WebMCP registrations, separate human confirmation, reduced-motion behavior, and no horizontal overflow at 320, 375, 390, 768, or 1920 px. The remaining differences are the intentional code-native simplifications above; no unresolved visual fidelity gap blocks owner review.
