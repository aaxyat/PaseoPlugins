import type { DashboardStore } from "./store.ts";
import type { DashboardTelemetryInput, DashboardTelemetryOutput } from "../shared/dashboard.ts";

export function createTelemetryHandler(store: DashboardStore) {
  return async (input: DashboardTelemetryInput): Promise<DashboardTelemetryOutput> => {
    return store.getTelemetry(input.workspaceId, input.agentId, input.provider);
  };
}

export function createOpenManagerHandler(_store: DashboardStore) {
  return async (_input: { workspaceId?: string }): Promise<{ success: boolean }> => {
    console.log("[dashboard] open subagents manager triggered");
    return { success: true };
  };
}
