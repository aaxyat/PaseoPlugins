import test from "node:test";
import assert from "node:assert/strict";
import { AmbientTelemetryOutputSchema } from "./ambient.ts";

test("AmbientTelemetryOutputSchema validates 5-hour and weekly limits for Antigravity", () => {
  const sample = {
    context: {
      usedTokens: 108600,
      maxTokens: 1000000,
      percentage: 10.9,
      costUsd: 0.89,
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
    tokens: {
      totalInputTokens: 29350000,
      cacheHitTokens: 28330000,
      cacheHitRatio: 96.5,
      outputTokens: 103000,
      rawApiCostUsd: 4.46,
      modelName: "gemini-3.8-flash-high",
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
        usedTokens: 108600,
        limit: 1000000,
        percentage: 10.9,
        fiveHourLimit: {
          percentage: 18.5,
          usedTokens: 185000,
          limitTokens: 1000000,
          resetsIn: "2h 45m",
        },
        weeklyLimit: {
          percentage: 24.0,
          usedTokens: 1200000,
          limitTokens: 5000000,
          resetsIn: "4d 8h",
        },
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
  assert.equal(parsed.engineUsage.antigravity.fiveHourLimit.resetsIn, "2h 45m");
  assert.equal(parsed.engineUsage.antigravity.weeklyLimit.percentage, 24.0);
  assert.equal(parsed.tokens.totalInputTokens, 29350000);
  assert.equal(parsed.tokens.cacheHitRatio, 96.5);
  assert.equal(parsed.tokens.rawApiCostUsd, 4.46);
});
