import type { PluginServerContext } from "@getpaseo/plugin/server";
import { dashboardTelemetryRpc, dashboardTriggerManagerRpc } from "./shared/dashboard.ts";
import { createDashboardStore } from "./server/store.ts";
import { createTelemetryHandler, createOpenManagerHandler } from "./server/handlers.ts";

export default function contribute(server: PluginServerContext) {
  const store = createDashboardStore();
  console.log("[dashboard] dashboard server service initialized");

  server.handle(dashboardTelemetryRpc, createTelemetryHandler(store));
  server.handle(dashboardTriggerManagerRpc, createOpenManagerHandler(store));

  // Listen to turn completions to record tool calls and track active provider
  const removeTurnEnded = server.on("agent.turn_ended", (event) => {
    try {
      if (event.agent.provider.toLowerCase().includes("opencode")) {
        store.setActiveProvider("opencode");
      } else if (event.agent.provider.toLowerCase().includes("antigravity")) {
        store.setActiveProvider("antigravity");
      }
      for (const item of event.timeline) {
        if (item.type === "tool_call") {
          const name = item.name.toLowerCase();
          if (name.includes("read") || name.includes("view") || name.includes("get")) {
            store.recordToolCall("read");
          } else if (name.includes("find") || name.includes("search") || name.includes("grep")) {
            store.recordToolCall("find");
          } else if (name.includes("edit") || name.includes("write") || name.includes("replace")) {
            store.recordToolCall("edit");
          } else {
            store.recordToolCall("bash");
          }
        }
      }
    } catch (err) {
      console.error("[ambient] error handling turn_ended", err);
    }
  });

  return () => {
    removeTurnEnded?.();
    console.log("[ambient] server unloaded");
  };
}
