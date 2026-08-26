# Devpost submission draft

## Project name

HelpRelay

## One-line description

When a browser moment feels risky, HelpRelay gives a person one bounded next step or a clear trusted-helper draft — never an automatic external action.

## Inspiration

Many people do not need a more powerful agent; they need an agent that makes uncertainty visible and pauses before a scary page turns into a costly click. HelpRelay treats the person, the browser agent, and a trusted helper as collaborators with different responsibilities.

## What we built

HelpRelay is a static, dependency-free WebMCP prototype with exactly five tools: understand the problem, collect visible evidence, propose one safe step, prepare a separated trusted brief, and request a draft-only handoff. The human interface is the primary product surface, and its live story calls the exact registered WebMCP executors used by an agent, visibly labelling that path.

The synthetic story uses a fictional urgent banner containing prompt-injection language and a suspicious invalid link. HelpRelay records it as untrusted, blocks the unsafe guess, offers one view-only/reversible review, and prepares a brief with facts, interpretations, uncertainty, and attempts. The story then pauses on the exact destination and payload preview; a separate human action represented by a one-time local receipt is required to prepare the draft, which still never sends.

## How WebMCP is used

The app statically calls `document.modelContext.registerTool` for the five imperative tools and awaits each registration result. `understand_problem` bootstraps a fresh session once and returns the complete envelope for later typed calls. Each definition has a concise description, closed input schema, annotations, and an execute function that forwards the browser-provided `AbortController` signal. A separate policy validates the envelope and action before the shared handler can mutate local state. Results are checked for a serializable text content block and structured content; partial registration deactivates every residual executor.

## Safety and privacy

The prototype has no network calls, API keys, analytics, storage, or external integrations. It never opens links, enters credentials, sends messages, buys anything, changes settings, changes permissions, deletes data, or controls a device. Guidance is bounded and safety-checked, not guaranteed safe. Browser content and model prose remain untrusted.

## Built with

HTML, CSS, ES modules, and Node `>=22` built-in test/server modules. No dependency install or build step is required.

## Links and media

- Live demo: https://akigarage.github.io/helprelay-webmcp/
- Demo video: `[YOUTUBE URL — HUMAN-ONLY FINALIZATION]`
- Repository: https://github.com/AkiGarage/helprelay-webmcp

## Claims we can support now

Executable tests cover the adversarial boundaries listed in `docs/ADVERSARIAL_TESTS.md`, registration, static-serving containment, and an end-to-end synthetic flow. On 2026-08-26, the deployed GitHub Pages artifact exposed all five tools and completed real tool calls in Codex's supported in-app browser. User research, guaranteed safety, final video publication, eligibility/legal review, and Devpost submission are not claimed.

## Fixed judging criteria

The criteria are equally weighted: **WebMCP Leverage**, **Execution**, **Potential Impact**, and **Creativity & Ambition**. If a tie remains, that listed order is the tie-break priority.
