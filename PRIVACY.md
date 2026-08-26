# Privacy

HelpRelay is designed to keep the competition demo local.

- The static page makes no network calls, uses no analytics, and does not use `localStorage`, `sessionStorage`, cookies, or a database.
- The story uses synthetic text only. It has no real links, trademarks, contact details, credentials, or personally identifying information.
- Browser-visible evidence entered into this page lives only in the in-memory session until the page is refreshed or closed. The app has no retention or sharing path.
- The trusted brief is a local preview. `request_handoff` does not send a message, email, notification, or request to a trusted person.
- The app does not ask for credentials, permissions, contacts, microphone access, screenshots, or location.

This document describes the current static prototype. A future product with server-backed model access, authenticated helpers, recording, or persistence would require a new privacy review and explicit consent flow. No OpenAI credentials belong in this iOS or browser client.
