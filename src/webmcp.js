import { TOOL_DEFINITIONS, TOOL_NAMES, failResult } from "./contracts.js?v=20260831h";
import { createDomainHandlers, guardToolResult } from "./tools.js?v=20260831h";

/**
 * Register exactly the five public HelpRelay tools on the current WebMCP
 * surface.  Registration is intentionally static: there is no discovery
 * request, network call, or dynamic code path involved.
 */
export async function registerWebMcpTools({ documentRef = globalThis.document, handlers = createDomainHandlers() } = {}) {
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
  const attemptedNames = [];
  const executors = new Map();
  let registrationActive = true;
  try {
    for (const definition of TOOL_DEFINITIONS) {
      // WebMCP execute receives an AbortController signal in its context.
      const tool = {
        ...definition,
        execute: async (input, context = {}) => {
          if (!registrationActive) {
            return guardToolResult(
              failResult("registration-incomplete", "The WebMCP tool surface did not register completely and is closed."),
            );
          }
          const signal = context?.signal;
          try {
            const result = await handlers.run(definition.name, input, { signal });
            return guardToolResult(result);
          } catch {
            return guardToolResult(failResult("internal-error", "The local policy handler closed the request safely."));
          }
        },
      };
      executors.set(definition.name, tool);
      attemptedNames.push(definition.name);
      // Keep the current WebMCP API call explicit for browser implementations
      // and for static inspection of the public seam.
      await documentRef.modelContext.registerTool(tool, { signal: registrationController.signal });
      names.push(definition.name);
    }
  } catch {
    registrationActive = false;
    registrationController.abort();
    const partialNames = [...attemptedNames];
    let rollbackComplete = partialNames.length === 0 || typeof modelContext.unregisterTool === "function";
    for (const name of [...partialNames].reverse()) {
      if (!rollbackComplete) break;
      try {
        await modelContext.unregisterTool(name);
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
      reason: rollbackComplete
        ? "The browser rejected WebMCP registration; the partial tool surface was rolled back."
        : "The browser rejected WebMCP registration; residual partial tools were deactivated because cleanup could not be verified.",
      handlers,
    };
  }

  return {
    registered: names.length === TOOL_NAMES.length,
    names,
    async run(name, input, context = {}) {
      const tool = executors.get(name);
      if (!tool) return guardToolResult(failResult("unknown-tool", "This tool is not part of the HelpRelay contract."));
      return tool.execute(input, context);
    },
    handlers,
  };
}

export async function autoRegisterWebMcp(handlers) {
  return registerWebMcpTools({ documentRef: globalThis.document, handlers });
}

export { TOOL_NAMES };
