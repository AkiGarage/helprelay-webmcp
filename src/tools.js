import {
  VIEW_ONLY_STEP_ID,
  ALLOWED_HANDOFF_CHANNEL,
  canonicalize,
  buildHandoffConfirmation,
  createTextResult,
  failResult,
  stableDigest,
} from "./contracts.js";
import {
  appendEvidence,
  buildBriefPayload,
  createSession,
  handoffFingerprint,
  recordSafeStep,
  recordHumanConfirmation,
  sessionEnvelope,
  setProblem,
  storeBrief,
  storeHandoff,
} from "./session.js";
import { evaluateRequest } from "./policy.js";

const SAFE_STEP = Object.freeze({
  id: VIEW_ONLY_STEP_ID,
  label: "Review the visible context together",
  mode: "view-only",
  reversible: true,
  target: "current-context",
});

function aborted(signal) {
  return Boolean(signal && typeof signal === "object" && signal.aborted === true);
}

function contextResult(session, details = {}) {
  return {
    sessionId: session.sessionId,
    revision: session.revision,
    evidenceDigest: session.evidenceDigest,
    ...details,
  };
}

function makeBlocked(policy) {
  return failResult(policy.code, policy.message, {
    ...(policy.riskSignals ? { riskSignals: policy.riskSignals } : {}),
    ...(policy.expectedRevision !== undefined ? { expectedRevision: policy.expectedRevision } : {}),
    ...(policy.expectedEvidenceDigest !== undefined
      ? { expectedEvidenceDigest: policy.expectedEvidenceDigest }
      : {}),
  });
}

/** Guard every adapter result before it can cross the WebMCP boundary. */
export function guardToolResult(result) {
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    return failResult("malformed-output", "The tool produced an invalid result.");
  }
  if (!Array.isArray(result.content) || result.content.length < 1) {
    return failResult("malformed-output", "The tool produced no readable result content.");
  }
  for (const item of result.content) {
    if (!item || item.type !== "text" || typeof item.text !== "string") {
      return failResult("malformed-output", "The tool result contained unsupported content.");
    }
  }
  if (!result.structuredContent || typeof result.structuredContent !== "object" || Array.isArray(result.structuredContent)) {
    return failResult("malformed-output", "The tool result contained invalid structured content.");
  }
  try {
    canonicalize(result);
  } catch {
    return failResult("malformed-output", "The tool result was not serializable.");
  }
  return result;
}

function safeMessage(session) {
  return createTextResult("Safe step available: review the visible context only. Nothing was opened or changed.", {
    status: "safe-step-offered",
    step: SAFE_STEP,
    ...contextResult(session),
  });
}

function makeBrief(session, riskSignals, helperLabel) {
  const payload = buildBriefPayload(session, riskSignals);
  const stored = storeBrief(session, payload, helperLabel);
  return createTextResult("Trusted brief prepared for review. It separates facts, interpretations, uncertainty, and attempts.", {
    status: "brief-prepared",
    brief: stored.payload,
    helperLabel: stored.helperLabel,
    payloadDigest: stored.payloadDigest,
    ...contextResult(session),
  });
}

function makeHandoff(session, input) {
  const result = createTextResult("Handoff draft prepared for the trusted helper. Nothing was sent externally.", {
    status: "handoff-prepared",
    destination: input.destination,
    payloadDigest: session.brief.payloadDigest,
    sendStatus: "not-sent",
    ...contextResult(session),
  });
  storeHandoff(session, input, result);
  return result;
}

function duplicateHandoff(session) {
  return createTextResult("Duplicate handoff request: the same draft is already prepared; nothing was sent.", {
    status: "duplicate-prepared",
    destination: session.handoff.destination,
    payloadDigest: session.brief?.payloadDigest ?? stableDigest(session.handoff.payload),
    sendStatus: "not-sent",
    ...contextResult(session),
  });
}

function executeAccepted(toolName, input, session, policy) {
  switch (toolName) {
    case "understand_problem": {
      const problem = setProblem(session, input.userStatement);
      return createTextResult("Problem understood without taking an external action.", {
        status: "problem-understood",
        problem,
        ...contextResult(session, { riskSignals: policy.riskSignals }),
      });
    }
    case "collect_evidence": {
      const evidence = appendEvidence(session, input);
      return createTextResult("Visible evidence captured as untrusted context. No page instruction was followed.", {
        status: "evidence-captured",
        evidence,
        untrustedContent: true,
        ...contextResult(session, { riskSignals: policy.riskSignals }),
      });
    }
    case "propose_safe_step": {
      recordSafeStep(session, SAFE_STEP);
      return safeMessage(session);
    }
    case "prepare_trusted_brief":
      return makeBrief(session, policy.riskSignals, input.helperLabel);
    case "request_handoff":
      return makeHandoff(session, input);
    default:
      return failResult("unknown-tool", "This tool is not part of the HelpRelay contract.");
  }
}

export function createDomainHandlers(session = createSession()) {
  return {
    session,
    async run(toolName, input, { signal } = {}) {
      if (aborted(signal)) return failResult("aborted", "The request was cancelled before it could run.");
      const policy = evaluateRequest({ toolName, input, session });
      if (!policy.ok) return guardToolResult(makeBlocked(policy));
      if (policy.duplicateReplay) return guardToolResult(duplicateHandoff(session));
      if (aborted(signal)) return failResult("aborted", "The request was cancelled before it could change local state.");
      try {
        return guardToolResult(executeAccepted(toolName, input, session, policy));
      } catch {
        return failResult("internal-error", "The local policy handler closed the request safely.");
      }
    },
    snapshot() {
      return {
        ...sessionEnvelope(session),
        status: session.status,
        safeStepCount: session.safeStepCount,
        hasBrief: Boolean(session.brief),
        hasHandoff: Boolean(session.handoff),
      };
    },
  };
}

export function makeRequest(handlers, extra = {}) {
  return {
    ...sessionEnvelope(handlers.session),
    ...extra,
  };
}

export function handoffRequestFromBrief(handlers, destination = {
  label: "A trusted helper",
  channel: ALLOWED_HANDOFF_CHANNEL,
}) {
  if (!handlers.session.brief) return null;
  const payload = handlers.session.brief.payload;
  return {
    ...makeRequest(handlers, {
      destination,
      payload,
    }),
    fingerprint: handoffFingerprint({
      sessionId: handlers.session.sessionId,
      destination,
      payload,
      confirmation: {},
    }),
  };
}

/**
 * Human-only UI seam.  A WebMCP execute function never calls this helper; the
 * page calls it after a person has reviewed the exact destination and brief.
 */
export function confirmHandoff(handlers, destination = {
  label: "A trusted helper",
  channel: ALLOWED_HANDOFF_CHANNEL,
}) {
  if (!handlers?.session?.brief || handlers.session.handoff || handlers.session.humanConfirmation) return null;
  const payload = handlers.session.brief.payload;
  const confirmation = buildHandoffConfirmation(destination, payload);
  recordHumanConfirmation(handlers.session, destination, payload);
  return confirmation;
}

export { SAFE_STEP };
