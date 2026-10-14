import type { AmbientTelemetryOutput, RadarEvent, MinimapTile, ToolCategory } from "../shared/ambient.ts";

export interface AmbientStore {
  getTelemetry(workspaceId?: string, agentId?: string): AmbientTelemetryOutput;
  recordToolCall(category: ToolCategory, durationMs?: number): void;
}

export function createAmbientStore(): AmbientStore {
  const categories: ("read" | "find" | "edit" | "bash")[] = ["read", "find", "edit", "bash"];
  
  // Generate initial rolling radar events
  const initialEvents: RadarEvent[] = [
    { id: "e1", offsetSec: -58, category: "edit", intensity: 0.7 },
    { id: "e2", offsetSec: -53, category: "bash", intensity: 0.6 },
    { id: "e3", offsetSec: -43, category: "find", intensity: 0.65 },
    { id: "e4", offsetSec: -34, category: "bash", intensity: 0.65 },
    { id: "e5", offsetSec: -23, category: "edit", intensity: 0.75 },
    { id: "e6", offsetSec: -20, category: "edit", intensity: 0.75 },
    { id: "e7", offsetSec: -8, category: "read", intensity: 0.7 },
    { id: "e8", offsetSec: 0, category: "read", intensity: 0.7 },
    { id: "e9", offsetSec: 10, category: "read", intensity: 0.7 },
    { id: "e10", offsetSec: 18, category: "bash", intensity: 0.8 },
  ];

  // Pre-populate 10x12 matrix (120 tiles)
  const pattern: ToolCategory[] = [
    "edit", "read", "bash", "edit", "read", "edit", "bash", "edit", "read", "empty", "read",
    "edit", "edit", "read", "bash", "edit", "find", "bash", "edit", "read", "find", "bash",
    "bash", "bash", "bash", "bash", "read", "empty", "edit", "edit", "read", "read", "read",
    "find", "read", "bash", "bash", "read", "bash", "edit", "find", "edit", "read", "read",
    "bash", "edit", "bash", "find", "bash", "find", "read", "find", "find", "bash", "edit",
    "edit", "edit", "bash", "find", "edit", "edit", "edit", "edit", "read", "read", "read",
    "read", "read", "read", "read", "read", "read", "edit", "bash", "edit", "read", "read",
    "read", "read", "read", "read", "empty", "read", "read", "read", "read", "read", "read",
    "read", "read", "read", "bash", "read", "read", "bash", "bash", "bash", "bash", "bash",
    "find", "edit", "edit", "edit", "edit", "edit", "edit", "edit", "empty", "read", "find"
  ];

  const tiles: MinimapTile[] = Array.from({ length: 120 }, (_, i) => ({
    index: i,
    category: pattern[i % pattern.length] ?? "empty",
  }));

  const sparkline = [
    30, 80, 25, 45, 30, 40, 35, 42, 38, 25, 40, 30, 35, 30, 25, 85, 30, 40, 50, 30, 45, 30, 30, 32, 28, 26, 80
  ];

  let currentTicker = 1791955784655;

  return {
    getTelemetry(workspaceId?: string, agentId?: string): AmbientTelemetryOutput {
      currentTicker += Math.floor(Math.random() * 5) + 1;
      return {
        context: {
          usedTokens: 94000,
          maxTokens: 1048576,
          percentage: 9.0,
          costUsd: 0.73,
          throughputTps: 92,
          sparkline,
        },
        radar: {
          windowSec: 60,
          currentTps: 92,
          events: initialEvents,
        },
        subagents: {
          status: "idle",
          activeCount: 0,
          description: "Agents spawned by task calls show up here, live.",
        },
        status: {
          badge: "extension",
          indicator: "active",
          magicContext: "mc: 94K (9%) · idle",
          ticker: currentTicker.toString(),
        },
        minimap: {
          sessionCount: 166,
          tiles,
        },
      };
    },
    recordToolCall(category: ToolCategory, durationMs = 200) {
      initialEvents.shift();
      initialEvents.push({
        id: `ev-${Date.now()}`,
        offsetSec: 0,
        category: category === "empty" || category === "system" ? "read" : category,
        intensity: Math.min(1, Math.max(0.4, durationMs / 1000)),
      });
    },
  };
}
