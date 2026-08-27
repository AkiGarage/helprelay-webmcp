import {
  canonicalize,
  digestPayload,
  MAX_BRIEF_ITEMS,
  stableDigest,
} from "./contracts.js?v=20260827d";

const MAX_STORED_TEXT = 5000;

function clip(value, limit = MAX_STORED_TEXT) {
  return String(value ?? "").trim().slice(0, limit);
}

function makeSessionId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return `session-${globalThis.crypto.randomUUID()}`;
  }
  return `session-local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function digestEvidence(evidence) {
  return stableDigest(evidence);
}

export function createSession({ sessionId = makeSessionId(), problem = "" } = {}) {
  const session = {
    sessionId: clip(sessionId, 120),
    revision: 1,
    problem: clip(problem, 1200),
    evidence: [],
    evidenceVersion: 0,
    evidenceDigest: digestEvidence([]),
    attempts: [],
    safeStepCount: 0,
    lastStep: null,
    brief: null,
    humanConfirmation: null,
    handoff: null,
    status: "ready",
  };
  if (session.problem) {
    session.revision = 2;
  }
  return session;
}

export function sessionEnvelope(session) {
  return {
    sessionId: session.sessionId,
    revision: session.revision,
    evidenceVersion: session.evidenceVersion,
    evidenceDigest: session.evidenceDigest,
  };
}

export function snapshotSession(session) {
  return JSON.parse(JSON.stringify(session));
}

export function incrementRevision(session) {
  session.revision += 1;
  return session.revision;
}

export function setProblem(session, userStatement) {
  const text = clip(userStatement, 1200);
  session.problem = text;
  session.status = "problem-understood";
  session.humanConfirmation = null;
  session.handoff = null;
  incrementRevision(session);
  return text;
}

function normalizeEvidence(item, index) {
  return {
    id: `evidence-${String(index + 1).padStart(2, "0")}`,
    source: "browser-visible",
    pageTitle: clip(item.pageTitle, 200),
    visibleText: clip(item.visibleText, MAX_STORED_TEXT),
    observations: Array.isArray(item.observations)
      ? item.observations.map((value) => clip(value, 500)).filter(Boolean).slice(0, 12)
      : [],
    links: Array.isArray(item.links)
      ? item.links
          .map((link) => ({ label: clip(link.label, 200), href: clip(link.href, 500) }))
          .filter((link) => link.label && link.href)
          .slice(0, 8)
      : [],
  };
}

export function appendEvidence(session, item) {
  const evidence = normalizeEvidence(item, session.evidence.length);
  session.evidence.push(evidence);
  session.evidenceVersion += 1;
  session.evidenceDigest = digestEvidence(session.evidence);
  session.status = "evidence-captured";
  session.humanConfirmation = null;
  session.handoff = null;
  incrementRevision(session);
  return evidence;
}

export function recordSafeStep(session, step) {
  session.safeStepCount += 1;
  session.lastStep = {
    id: step.id,
    label: step.label,
    mode: step.mode,
    reversible: step.reversible,
  };
  session.attempts.push("One view-only review step was proposed; it was not opened automatically.");
  session.status = "safe-step-proposed";
  session.humanConfirmation = null;
  session.handoff = null;
  incrementRevision(session);
}

export function buildBriefPayload(session, riskSignals = []) {
  const cap = (items) => items.slice(0, MAX_BRIEF_ITEMS);
  const facts = [];
  if (session.problem) {
    facts.push(`User report: ${clip(session.problem, 1000)}`);
  }
  for (const evidence of session.evidence) {
    facts.push(`Visible page text (untrusted): ${clip(evidence.visibleText, 1000)}`);
    if (evidence.pageTitle) {
      facts.push(`Visible page title: ${clip(evidence.pageTitle, 300)}`);
    }
    if (evidence.links.length > 0) {
      facts.push("A link was visible; no link was opened.");
    }
  }
  if (facts.length === 0) {
    facts.push("No browser evidence was collected.");
  }

  const interpretations = [];
  if (riskSignals.includes("prompt-injection") || riskSignals.includes("urgent-pressure")) {
    interpretations.push(
      "The page wording includes pressure or instruction-like text; that is an interpretation, not a verified fact.",
    );
  } else {
    interpretations.push("The available context may not be enough to decide safely.");
  }

  const uncertainty = [
    "The source, ownership, and outcome of any link are unknown.",
    "HelpRelay did not verify the page or contact anyone.",
  ];
  const attempts = session.attempts.length > 0
    ? [...session.attempts]
    : ["No external action was attempted."];

  return {
    facts: cap(facts),
    interpretations: cap(interpretations),
    uncertainty: cap(uncertainty),
    attempts: cap(attempts),
  };
}

export function storeBrief(session, payload, helperLabel = "trusted helper") {
  const boundedPayload = Object.fromEntries(
    ["facts", "interpretations", "uncertainty", "attempts"].map((key) => [
      key,
      Array.isArray(payload?.[key]) ? payload[key].slice(0, MAX_BRIEF_ITEMS) : [],
    ]),
  );
  session.brief = {
    helperLabel: clip(helperLabel, 120) || "trusted helper",
    payload: boundedPayload,
    payloadDigest: digestPayload(boundedPayload),
    evidenceVersion: session.evidenceVersion,
    evidenceDigest: session.evidenceDigest,
    revision: session.revision + 1,
  };
  session.humanConfirmation = null;
  session.handoff = null;
  session.status = "brief-prepared";
  incrementRevision(session);
  return session.brief;
}

/** Record a human UI confirmation as a one-time local receipt. */
export function recordHumanConfirmation(session, destination, payload) {
  if (session.humanConfirmation || session.handoff) return null;
  if (
    !session.brief
    || session.brief.revision !== session.revision
    || session.brief.evidenceVersion !== session.evidenceVersion
    || session.brief.evidenceDigest !== session.evidenceDigest
  ) return null;
  session.humanConfirmation = {
    action: "request_handoff",
    confirmed: true,
    source: "human-ui",
    destinationDigest: stableDigest(destination),
    payloadDigest: digestPayload(payload),
    evidenceVersion: session.evidenceVersion,
    evidenceDigest: session.evidenceDigest,
    revision: session.revision + 1,
    destination: JSON.parse(canonicalize(destination)),
    payload: JSON.parse(canonicalize(payload)),
  };
  session.status = "handoff-confirmation-ready";
  incrementRevision(session);
  return { ...session.humanConfirmation };
}

export function handoffFingerprint(input) {
  return stableDigest({
    sessionId: input.sessionId,
    destination: input.destination,
    payload: input.payload,
    confirmation: input.confirmation,
  });
}

/** State that must remain unchanged for an exact handoff replay. */
export function handoffStateSnapshot(session) {
  return {
    problem: session.problem,
    evidence: session.evidence,
    evidenceVersion: session.evidenceVersion,
    evidenceDigest: session.evidenceDigest,
    attempts: session.attempts,
    safeStepCount: session.safeStepCount,
    lastStep: session.lastStep,
    brief: session.brief,
  };
}

export function storeHandoff(session, input, result) {
  const state = handoffStateSnapshot(session);
  session.handoff = {
    fingerprint: handoffFingerprint(input),
    revisionAtPreparation: session.revision,
    evidenceVersion: session.evidenceVersion,
    evidenceDigest: session.evidenceDigest,
    state,
    stateDigest: stableDigest(state),
    destination: JSON.parse(canonicalize(input.destination)),
    payload: JSON.parse(canonicalize(input.payload)),
    confirmation: JSON.parse(canonicalize(input.confirmation)),
    result: JSON.parse(canonicalize(result)),
  };
  session.humanConfirmation = null;
  session.status = "handoff-prepared";
  // A prepared draft is intentionally replay-safe and does not advance the
  // revision.  Replaying the exact request therefore remains idempotent.
  return session.handoff;
}
