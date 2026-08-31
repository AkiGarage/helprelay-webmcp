import {
  ALLOWED_HANDOFF_CHANNEL,
  MAX_EVIDENCE_ITEMS,
  TOOL_NAMES,
  TOOL_SCHEMAS,
  VIEW_ONLY_STEP_ID,
  canonicalize,
  digestPayload,
  isPlainObject,
  stableDigest,
} from "./contracts.js?v=20260831h";
import { handoffFingerprint, handoffStateSnapshot } from "./session.js?v=20260831h";

const RISK_PATTERNS = Object.freeze([
  ["prompt-injection", /ignore\s+(?:all|any|the|previous|prior)|disregard\s+(?:all|any|the|previous|prior)|system\s+message|developer\s+message|reveal\s+(?:the|your)\s+instructions/i],
  ["suspicious-link", /(?:https?|hxxps?):\/\/|www\.|bit\.ly|tinyurl|\.invalid\b/i],
  ["credential-request", /password|passcode|one[- ]time\s+code|\botp\b|seed\s+phrase|private\s+key|credit\s+card/i],
  ["urgent-pressure", /urgent|immediately|act\s+now|click\s+now|do\s+this\s+now|verify\s+now|account\s+(?:suspend|close|locked)|last\s+warning/i],
  ["external-action", /\b(?:click|download|install|send|pay|purchase|delete|remove|allow|enable|grant|open|call|message)\b/i],
]);

const UNSAFE_STEP_WORDS = /delete|remove|purchase|pay|checkout|send|message|email|call|login|sign[- ]?in|password|credential|permission|setting|install|download|open|click|navigate|upload|submit|device|browser/i;

function failure(code, message, details = {}) {
  return { ok: false, code, message, ...details };
}

function success(details = {}) {
  return { ok: true, ...details };
}

function typeMatches(value, schema) {
  if (schema.type === "object") return isPlainObject(value);
  if (schema.type === "array") return Array.isArray(value);
  if (schema.type === "string") return typeof value === "string";
  if (schema.type === "boolean") return typeof value === "boolean";
  if (schema.type === "integer") return Number.isInteger(value);
  if (schema.type === "number") return typeof value === "number" && Number.isFinite(value);
  return false;
}

function validateSchema(value, schema, path = "input") {
  if (!typeMatches(value, schema)) {
    return `${path} must be ${schema.type}`;
  }
  if (schema.enum && !schema.enum.includes(value)) {
    return `${path} is not an allowed value`;
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      return `${path} is too short`;
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      return `${path} is too long`;
    }
  }
  if (Number.isInteger(value)) {
    if (schema.minimum !== undefined && value < schema.minimum) return `${path} is too small`;
    if (schema.maximum !== undefined && value > schema.maximum) return `${path} is too large`;
  }
  if (Array.isArray(value)) {
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      return `${path} has too many items`;
    }
    if (schema.items) {
      for (let index = 0; index < value.length; index += 1) {
        const error = validateSchema(value[index], schema.items, `${path}[${index}]`);
        if (error) return error;
      }
    }
  }
  if (isPlainObject(value)) {
    const required = schema.required ?? [];
    for (const key of required) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        return `${path}.${key} is required`;
      }
    }
    const allowed = new Set(Object.keys(schema.properties ?? {}));
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!allowed.has(key)) return `${path}.${key} is not allowed`;
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const error = validateSchema(value[key], childSchema, `${path}.${key}`);
        if (error) return error;
      }
    }
  }
  return null;
}

export function validateToolInput(toolName, input) {
  if (!TOOL_NAMES.includes(toolName)) {
    return failure("unknown-tool", "This tool is not part of the HelpRelay contract.");
  }
  if (!isPlainObject(input)) {
    return failure("malformed-input", "Input must be a JSON object.");
  }
  const error = validateSchema(input, TOOL_SCHEMAS[toolName]);
  if (error) return failure("malformed-input", error);
  return success();
}

function collectStrings(value, path = "input", output = []) {
  if (typeof value === "string") {
    output.push({ path, text: value });
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${path}[${index}]`, output));
    return output;
  }
  if (isPlainObject(value)) {
    Object.entries(value).forEach(([key, item]) => collectStrings(item, `${path}.${key}`, output));
  }
  return output;
}

export function detectRiskSignals(input) {
  const signals = new Set();
  for (const { text } of collectStrings(input)) {
    for (const [name, pattern] of RISK_PATTERNS) {
      if (pattern.test(text)) signals.add(name);
    }
  }
  return [...signals].sort();
}

function sameJson(left, right) {
  try {
    return canonicalize(left) === canonicalize(right);
  } catch {
    return false;
  }
}

function isExactHandoffReplay(input, session) {
  if (!session.handoff || input.sessionId !== session.sessionId) return false;
  if (input.revision !== session.revision || input.revision !== session.handoff.revisionAtPreparation) return false;
  if (session.handoff.evidenceVersion !== session.evidenceVersion) return false;
  if (input.evidenceVersion !== session.handoff.evidenceVersion) return false;
  if (session.handoff.evidenceDigest !== session.evidenceDigest) return false;
  if (input.evidenceDigest !== session.handoff.evidenceDigest) return false;
  if (session.handoff.stateDigest !== stableDigest(handoffStateSnapshot(session))) return false;
  if (!sameJson(handoffStateSnapshot(session), session.handoff.state)) return false;
  if (!sameJson(input.destination, session.handoff.destination)) return false;
  if (!sameJson(input.payload, session.handoff.payload)) return false;
  if (!sameJson(input.confirmation, session.handoff.confirmation)) return false;
  return handoffFingerprint(input) === session.handoff.fingerprint;
}

function validateDestination(destination) {
  if (destination.channel !== ALLOWED_HANDOFF_CHANNEL) {
    return failure(
      "destination-not-allowlisted",
      "Only the local trusted-helper draft channel is allowed; nothing will be sent.",
    );
  }
  if (/(?:https?|hxxps?):\/\/|www\.|@/.test(destination.label)) {
    return failure("destination-not-allowlisted", "A URL or address is not an allowed destination.");
  }
  return success();
}

function validateSafeStep(input, session, riskSignals) {
  if (session.safeStepCount >= 1) {
    return failure("safe-step-limit", "Only one canonical view-only step may be proposed in a session.", {
      riskSignals,
    });
  }
  if (input.stepId !== VIEW_ONLY_STEP_ID) {
    return failure("unsafe-step", "That action is outside the allowlist. HelpRelay will not operate the browser.", {
      riskSignals,
    });
  }
  if (input.target && input.target !== "current-context") {
    return failure("external-target", "The allowlisted step has no external target or URL.", { riskSignals });
  }
  if (input.reason && UNSAFE_STEP_WORDS.test(input.reason)) {
    return failure("unsafe-request-wording", "The requested wording implies an external or irreversible action.", {
      riskSignals,
    });
  }
  return success({ riskSignals });
}

function validateHandoff(input, session, riskSignals) {
  if (!session.brief) {
    return failure("brief-required", "Prepare a trusted brief before requesting a handoff.", { riskSignals });
  }
  const destinationCheck = validateDestination(input.destination);
  if (!destinationCheck.ok) return { ...destinationCheck, riskSignals };
  if (!sameJson(input.payload, session.brief.payload)) {
    return failure("payload-mismatch", "The handoff payload must exactly match the prepared brief.", { riskSignals });
  }
  if (
    session.brief.evidenceVersion !== session.evidenceVersion
    || session.brief.evidenceDigest !== session.evidenceDigest
  ) {
    return failure("brief-stale", "The trusted brief is stale because the evidence changed; prepare it again.", {
      riskSignals,
    });
  }
  if (!session.humanConfirmation) {
    return failure("handoff-confirmation-required", "A separate human UI confirmation receipt is required before preparing this draft.", {
      riskSignals,
    });
  }
  if (!input.confirmation.confirmed) {
    return failure("handoff-confirmation-required", "A separate human confirmation is required before preparing this draft.", {
      riskSignals,
    });
  }
  if (input.confirmation.source !== "human-ui" || input.confirmation.action !== "request_handoff") {
    return failure("handoff-confirmation-required", "Only a human UI confirmation can approve this draft.", { riskSignals });
  }
  if (
    session.humanConfirmation.revision !== session.revision
    || session.humanConfirmation.evidenceVersion !== session.evidenceVersion
    || session.humanConfirmation.evidenceDigest !== session.evidenceDigest
  ) {
    return failure("confirmation-stale", "The separate human confirmation is stale; review the current brief again.", {
      riskSignals,
    });
  }
  if (input.confirmation.destinationDigest !== stableDigest(input.destination)) {
    return failure("confirmation-mismatch", "The confirmed destination does not match the requested destination.", { riskSignals });
  }
  if (input.confirmation.payloadDigest !== digestPayload(input.payload)) {
    return failure("confirmation-mismatch", "The confirmed payload does not match the requested brief.", { riskSignals });
  }
  if (
    !sameJson(input.destination, session.humanConfirmation.destination)
    || !sameJson(input.payload, session.humanConfirmation.payload)
  ) {
    return failure("confirmation-mismatch", "The request confirmation does not match the separate human UI receipt.", {
      riskSignals,
    });
  }
  return success({ riskSignals });
}

/**
 * The policy is deliberately independent from prose generation and handlers.
 * It validates the complete request envelope before any session mutation.
 */
export function evaluateRequest({ toolName, input, session }) {
  const shape = validateToolInput(toolName, input);
  if (!shape.ok) return shape;
  if (!session || !isPlainObject(session)) {
    return failure("session-unavailable", "The current session is unavailable; the request is closed.");
  }
  const envelopeFields = ["sessionId", "revision", "evidenceVersion", "evidenceDigest"];
  const suppliedEnvelopeFields = envelopeFields.filter((field) => Object.prototype.hasOwnProperty.call(input, field));
  if (toolName === "understand_problem" && suppliedEnvelopeFields.length === 0) {
    if (
      session.status !== "ready"
      || session.revision !== 1
      || session.evidenceVersion !== 0
      || session.evidence.length !== 0
    ) {
      return failure("bootstrap-closed", "This session has already started; use the envelope returned by the first call.");
    }
    return success({ riskSignals: detectRiskSignals(input), bootstrap: true });
  }
  if (toolName === "understand_problem" && suppliedEnvelopeFields.length !== envelopeFields.length) {
    return failure("malformed-input", "Provide the complete session envelope, or omit all envelope fields for the first call.");
  }
  if (input.sessionId !== session.sessionId) {
    return failure("session-mismatch", "The request belongs to a different session.");
  }

  const evidenceRiskSignals = Array.isArray(session.evidence)
    ? detectRiskSignals(session.evidence)
    : [];
  const riskSignals = [...new Set([...detectRiskSignals(input), ...evidenceRiskSignals])].sort();
  const duplicateReplay = toolName === "request_handoff" && isExactHandoffReplay(input, session);
  if (!duplicateReplay && input.revision !== session.revision) {
    return failure("revision-stale", "The request revision is stale; refresh the visible state and try again.", {
      riskSignals,
      expectedRevision: session.revision,
    });
  }
  if (!duplicateReplay && input.evidenceVersion !== session.evidenceVersion) {
    return failure("evidence-version-stale", "The evidence generation is stale; refresh the visible state and try again.", {
      riskSignals,
      expectedEvidenceVersion: session.evidenceVersion,
    });
  }
  if (!duplicateReplay && input.evidenceDigest !== session.evidenceDigest) {
    return failure("evidence-stale", "The evidence digest is stale; do not act on outdated page context.", {
      riskSignals,
      expectedEvidenceDigest: session.evidenceDigest,
    });
  }
  if (duplicateReplay) {
    return success({ duplicateReplay: true, riskSignals });
  }

  switch (toolName) {
    case "understand_problem":
      return success({ riskSignals });
    case "collect_evidence":
      if (session.evidence.length >= MAX_EVIDENCE_ITEMS) {
        return failure("evidence-limit", "The evidence limit has been reached; no more browser context will be accepted.", {
          riskSignals,
          maxEvidenceItems: MAX_EVIDENCE_ITEMS,
        });
      }
      return success({ riskSignals, untrustedContent: true });
    case "propose_safe_step":
      return validateSafeStep(input, session, riskSignals);
    case "prepare_trusted_brief":
      if (session.safeStepCount < 1) {
        return failure("safe-step-required", "Offer the one safe view-only step before escalating to a trusted person.", {
          riskSignals,
        });
      }
      return success({ riskSignals });
    case "request_handoff":
      return validateHandoff(input, session, riskSignals);
    default:
      return failure("unknown-tool", "This tool is not part of the HelpRelay contract.");
  }
}
