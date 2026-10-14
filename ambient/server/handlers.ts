import type { AmbientStore } from "./store.ts";
import type { AmbientTelemetryInput, AmbientTelemetryOutput } from "../shared/ambient.ts";

export function createTelemetryHandler(store: AmbientStore) {
  return async (input: AmbientTelemetryInput): Promise<AmbientTelemetryOutput> => {
    return store.getTelemetry(input.workspaceId, input.agentId, input.provider);
  };
}

export function createOpenManagerHandler(store: AmbientStore) {
  return async (_input: { workspaceId?: string }): Promise<{ success: boolean }> => {
    console.log("[ambient] open subagents manager triggered");
    return { success: true };
  };
}
