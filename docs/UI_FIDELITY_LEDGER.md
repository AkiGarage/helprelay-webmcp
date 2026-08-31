# UI fidelity ledger — Quiet Companion

Implementation reference: `docs/UI_CONCEPT_SPEC.md`

Actual screenshots:

- `docs/assets/helprelay-ja-desktop-initial.png`
- `docs/assets/helprelay-ja-desktop-running.png`
- `docs/assets/helprelay-ja-desktop.png`
- `docs/assets/helprelay-ja-mobile-initial.png`
- `docs/assets/helprelay-ja-mobile-running.png`
- `docs/assets/helprelay-ja-mobile.png`
- `docs/assets/helprelay-ja-mobile-handoff-preview.png`

## Concept-to-code comparison

| Comparison point | Concept | Implemented result | Verdict |
| --- | --- | --- | --- |
| Gaze path | One centered reassurance-to-action path | Headline → three stages → current problem → one button; details remain collapsed | Match |
| State recognition | Stable surface changes in place | Ready, checking, safe result, brief preparation, and confirmation preview replace the same working surface and scroll into view after a press | Match |
| Safety contrast | Coral stop beside jade view-only result | Both outcomes use icon, heading, explanatory sentence, and color; the third journey step activates only when a help note is requested | Match |
| Consumer language | No technology knowledge required | Default Japanese removes visible WebMCP jargon and localizes the help note and event log; exact tool names remain available inside the safety disclosure | Match |
| Tactile finish | White canvas, deep navy, restrained cobalt, soft depth | Code-native mark, one contact shadow, 61–68 px main controls, clear press/focus states, warm coral and jade surfaces | Match |

## Copy changes from the rejected UI

Removed or moved behind disclosures:

- technical-demo framing and WebMCP terminology in the normal path
- simultaneous workflow cards, branch lines, and equal-weight choices
- English prompt-injection text in the Japanese help note
- progress that completed in about two seconds without a readable current action

Replaced with:

- `大丈夫。いっしょに確認しましょう。`
- `画面を変えたり、誰かに送ったりしません。`
- `この画面を確認する`
- `まず、何に困っているのか受け止めています…`
- `危ないかもしれないリンクを止めました。何も開いていません。`
- a separate `相談メモを作る` decision and a later `この下書き内容を確認する` decision

## Intentional deviations

- The concept uses a more open result canvas. The implementation retains one subtle enclosing surface so ready, running, result, and handoff states do not jump vertically and mobile users keep their place.
- The implementation adds two short result rows beneath the coral heading. This is more explicit than the concept, but distinguishes “what was stopped” from “what is safe to do” for people who cannot infer meaning from color.
- The concept uses a decorative logo. The implementation uses a code-native line mark to avoid third-party assets and preserve sharp rendering.
- Exact tool names and raw structured data are not visible by default. They remain inspectable for judges without imposing developer language on the person seeking help.

## Visual QA evidence

- Browser method: Codex in-app Browser, real page-loaded WebMCP registrations, viewport override at 1920×1080, 390×844, and 320×844.
- 1920×1080: one primary task surface; checking and result remain fully visible after activation.
- 390×844: active work automatically moves into view; safe result and handoff preview remain in the same column; no horizontal overflow.
- 320×844: `scrollWidth === innerWidth`; visible mobile action is 61 px high.
- Reduced motion: browser-emulated `prefers-reduced-motion: reduce` matched; progress dots and status pulse reported `animation-name: none`, with `scroll-behavior: auto`.
- WebMCP: the browser reported all five page-defined tools from the local page. The exercised UI path called the real registered executor, stopped at progress 3 before brief creation, paused before `request_handoff`, and recorded `外部には送っていません` only after the separate human confirmation.
- Regression checks: `npm test` passed 27/27 executable tests, including visible-evidence matching and stale async-result isolation; `npm run check` passed all required-file and module checks.

## Agency signoff

The implemented Japanese view was compared directly with the selected desktop concept and inspected in the real browser at desktop and mobile sizes. The five concept comparison points above match, and the four differences are intentional human-factors adaptations rather than unfinished fidelity gaps. This revision is at agency-signoff fidelity for Aki’s hands-on review; no unresolved visual defect blocks the live preview.
