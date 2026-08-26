import { TOOL_DEFINITIONS, TOOL_NAMES, failResult } from "./contracts.js";
import { createDomainHandlers, guardToolResult } from "./tools.js";

/**
 * Register exactly the five public HelpRelay tools on the current WebMCP
 * surface.  Registration is intentionally static: there is no discovery
 * request, network call, or dynamic code path involved.
 */
export function registerWebMcpTools({ documentRef = globalThis.document, handlers = createDomainHandlers() } = {}) {
  const modelContext = documentRef?.modelContext;
  if (!modelContext || typeof modelContext.registerTool !== "function") {
    return {
      registered: false,
      names: [],
      reason: "document.modelContext.registerTool is unavailable in this browser.",
      handlers,
    };
  }

  const registrationController = new AbortController();
  const names = [];
  try {
    for (const definition of TOOL_DEFINITIONS) {
      // WebMCP execute receives an AbortController signal in its context.
      const tool = {
        ...definition,
        execute: async (input, context = {}) => {
          const signal = context?.signal;
          try {
            const result = await handlers.run(definition.name, input, { signal });
            return guardToolResult(result);
          } catch {
            return guardToolResult(failResult("internal-error", "The local policy handler closed the request safely."));
          }
        },
      };
      // Keep the current WebMCP API call explicit for browser implementations
      // and for static inspection of the public seam.
      documentRef.modelContext.registerTool(tool, { signal: registrationController.signal });
      names.push(definition.name);
    }
  } catch {
    registrationController.abort();
    const partialNames = [...names];
    let rollbackComplete = partialNames.length === 0 || typeof modelContext.unregisterTool === "function";
    for (const name of [...partialNames].reverse()) {
      if (!rollbackComplete) break;
      try {
        modelContext.unregisterTool(name);
      } catch {
        rollbackComplete = false;
      }
    }
    return {
      registered: false,
      names: [],
      partialNames,
      rollbackAttempted: partialNames.length > 0,
      rollbackComplete,
      reason: "The browser rejected WebMCP registration; the partial tool surface was rolled back.",
      handlers,
    };
  }

  return {
    registered: names.length === TOOL_NAMES.length,
    names,
    handlers,
  };
}

export function autoRegisterWebMcp(handlers) {
  return registerWebMcpTools({ documentRef: globalThis.document, handlers });
}

export { TOOL_NAMES };
