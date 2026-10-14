import test from "node:test";
import assert from "node:assert/strict";
import { AmbientTelemetryOutputSchema } from "./ambient.ts";

test("AmbientTelemetryOutputSchema validates telemetry output structure with EngineUsage", () => {
  const sample = {
    context: {
      usedTokens: 99700,
      maxTokens: 1000000,
      percentage: 10.0,
      costUsd: 0.81,
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
      provider: "antigravity",
      ticker: "1791957502497",
    },
    engineUsage: {
      activeProvider: "antigravity",
      antigravity: {
        model: "gemini-3.8-flash-high",
        usedTokens: 99700,
        limit: 1000000,
        percentage: 10.0,
        rpm: 14,
        rpmLimit: 60,
        tpm: 1370000,
        tpmLimit: 4000000,
        dailyReqs: 297,
        dailyLimit: 1500,
      },
      opencode: {
        model: "claude-3.7-sonnet",
        usedTokens: 15000,
        limit: 200000,
        percentage: 7.5,
        costUsd: 0.18,
        sessionTurns: 12,
        status: "ready",
      },
    },
  };

  const parsed = AmbientTelemetryOutputSchema.parse(sample);
  assert.equal(parsed.context.percentage, 10.0);
  assert.equal(parsed.engineUsage.activeProvider, "antigravity");
  assert.equal(parsed.engineUsage.antigravity.model, "gemini-3.8-flash-high");
});
