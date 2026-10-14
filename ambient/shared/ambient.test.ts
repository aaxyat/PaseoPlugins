import test from "node:test";
import assert from "node:assert/strict";
import { AmbientTelemetryOutputSchema } from "./ambient.ts";

test("AmbientTelemetryOutputSchema validates telemetry output structure", () => {
  const sample = {
    context: {
      usedTokens: 94000,
      maxTokens: 1048576,
      percentage: 9.0,
      costUsd: 0.73,
      throughputTps: 92,
      sparkline: [20, 45, 30, 60, 40, 85, 55, 92],
    },
    radar: {
      windowSec: 60,
      currentTps: 92,
      events: [
        { id: "e1", offsetSec: -55, category: "read", intensity: 0.8 },
        { id: "e2", offsetSec: -30, category: "bash", intensity: 0.9 },
      ],
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
      ticker: "1791955784655",
    },
    minimap: {
      sessionCount: 166,
      tiles: [
        { index: 0, category: "read" },
        { index: 1, category: "find" },
      ],
    },
  };

  const parsed = AmbientTelemetryOutputSchema.parse(sample);
  assert.equal(parsed.context.percentage, 9.0);
  assert.equal(parsed.radar.events.length, 2);
  assert.equal(parsed.status.badge, "extension");
});
