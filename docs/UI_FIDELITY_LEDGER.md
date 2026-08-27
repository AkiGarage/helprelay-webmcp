# UI fidelity ledger — The Safe Relay

Implementation reference: `docs/UI_CONCEPT_SPEC.md`

## Concept-to-code comparison

| Concept promise | Implemented evidence | Result |
| --- | --- | --- |
| One relay joins the person, policy, and trusted helper | A single open `relay-stage` uses three named scenes, shared route lines, and hairline separators | Match |
| The unsafe path visibly stops before any action | Coral `Open suspicious link` branch ends inside `propose_safe_step` and becomes `Blocked` | Match |
| One safe, reversible path continues | Jade `Review visible context` branch continues to the helper scene and states that no link opens or changes | Match |
| Five real WebMCP tools are central, not decorative | All five exact tool names are the middle route; actual states update during the registered execution path | Match |
| Trusted Brief is a preview, not a sent message | The right scene shows destination and separated brief content, an explicit local-only confirmation, and `Nothing has been sent` | Match |
| Technical evidence stays secondary | The WebMCP event log is collapsed below the single dominant action | Match |
| Warm, readable, consumer-facing tone | Humanist local type, 17 px body copy, oat reassurance, large controls, plain conversation copy, no dashboard navigation | Match |
| Mobile becomes a natural vertical relay | At 390 px the route stacks in reading order, adds an early copy of the same primary action, keeps 52 px controls, and has no horizontal overflow | Match |
| Motion reassures without becoming decoration | Route progress and state transitions use 160–420 ms motion; the reduced-motion query collapses them to `0.01ms` and disables smooth scrolling | Match |

## Intentional deviations

- The generated concept used a braided photoreal route. The implementation uses code-native solid paths so state changes remain crisp, lightweight, and fully reduced-motion compatible.
- The generated concept contained more pictograms and nested preview rows. The implementation removes decorative icons and formats the brief as plain language to reduce visual and cognitive load.
- Mobile exposes the primary action before the long relay, instead of only after it, so a person does not need to discover an action roughly 1,900 px below the opening view.

## Above-the-fold copy diff

Removed from the old opening view:

- `WebMCP Challenge · safety-first demo`
- the long marketing explanation of browser-agent collaboration
- separate comparison-card headings and repeated descriptions
- `A synthetic 15-second browser story`

Replaced with:

- `The Safe Relay`
- `Let’s pause before you tap.`
- one sentence describing check → stop → safe step
- the person's concern, exact five tool names, unsafe stop, safe view-only route, local brief, separate confirmation, and no-send reassurance in one stage

## Agency signoff

Desktop 1920×1080 and mobile 390×844 were compared against the selected ImageGen references in the same visual QA pass. The remaining differences are intentional code-native simplifications documented above; no unresolved fidelity gap blocks owner review.
