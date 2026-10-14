import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import type {
  AmbientTelemetryOutput,
  RadarEvent,
  ToolCategory,
  EngineUsage,
} from "../shared/ambient.ts";

export interface AmbientStore {
  getTelemetry(
    workspaceId?: string,
    agentId?: string,
    provider?: "antigravity" | "opencode",
  ): AmbientTelemetryOutput;
  recordToolCall(category: ToolCategory, durationMs?: number): void;
  setActiveProvider(provider: "antigravity" | "opencode"): void;
}

interface QuotaSnapshot {
  used_tokens: number;
  limit: number;
  usage_pct: number;
  rpm: number;
  tpm: number;
  daily_reqs: number;
  daily_limit: number;
  model_name: string;
  updated_at: number;
}

function resolveSnapshotPath(): string | null {
  const localAppData = process.env.LOCALAPPDATA;
  if (localAppData) {
    const winPath = join(localAppData, "antigravity", "quota_tracker", "quota_snapshot.json");
    if (existsSync(winPath)) return winPath;
  }
  const cachePath = join(homedir(), ".cache", "antigravity", "quota_tracker", "quota_snapshot.json");
  if (existsSync(cachePath)) return cachePath;
  return null;
}

export function createAmbientStore(): AmbientStore {
  const recordedEvents: { timestamp: number; category: "read" | "find" | "edit" | "bash"; intensity: number }[] = [];
  const sparklineHistory: number[] = [
    30, 45, 60, 35, 40, 50, 75, 40, 30, 55, 38, 42, 65, 80, 55, 92, 45, 60, 70, 85, 40, 65, 75, 88, 62, 92
  ];

  let currentActiveProvider: "antigravity" | "opencode" = "antigravity";

  const now = Date.now();
  recordedEvents.push(
    { timestamp: now - 55000, category: "read", intensity: 0.7 },
    { timestamp: now - 48000, category: "bash", intensity: 0.65 },
    { timestamp: now - 36000, category: "find", intensity: 0.8 },
    { timestamp: now - 25000, category: "edit", intensity: 0.9 },
    { timestamp: now - 18000, category: "read", intensity: 0.6 },
    { timestamp: now - 10000, category: "bash", intensity: 0.75 },
    { timestamp: now - 2000, category: "edit", intensity: 0.85 },
  );

  return {
    setActiveProvider(provider: "antigravity" | "opencode") {
      currentActiveProvider = provider;
    },

    getTelemetry(
      _workspaceId?: string,
      _agentId?: string,
      requestedProvider?: "antigravity" | "opencode",
    ): AmbientTelemetryOutput {
      let quota: QuotaSnapshot | null = null;
      const snapshotPath = resolveSnapshotPath();
      if (snapshotPath) {
        try {
          const raw = readFileSync(snapshotPath, "utf-8");
          quota = JSON.parse(raw);
        } catch (e) {
          console.warn("[ambient] could not read live quota snapshot", e);
        }
      }

      const currentTime = Date.now();

      // Prune events older than 60s
      while (recordedEvents.length > 0 && currentTime - recordedEvents[0].timestamp > 60000) {
        recordedEvents.shift();
      }

      // Format radar events
      const radarEvents: RadarEvent[] = recordedEvents.map((ev, idx) => ({
        id: `ev-${idx}-${ev.timestamp}`,
        offsetSec: Math.round((ev.timestamp - currentTime) / 1000),
        category: ev.category,
        intensity: ev.intensity,
      }));

      // Metrics
      const usedTokens = quota?.used_tokens ?? 100000;
      const maxTokens = quota?.limit ?? 1000000;
      const percentage = quota?.usage_pct != null ? Number(quota.usage_pct.toFixed(1)) : 10.0;
      const tpm = quota?.tpm ?? 1380000;
      const tps = Math.max(12, Math.round(tpm / 60 / 250));
      const costUsd = Number(((usedTokens / 1_000_000) * 8.2).toFixed(2));
      const dailyReqs = quota?.daily_reqs ?? 300;
      const rpm = quota?.rpm ?? 14;

      sparklineHistory.shift();
      sparklineHistory.push(Math.min(95, Math.max(20, tps + Math.floor(Math.random() * 8) - 4)));

      const updatedAtMs = quota?.updated_at ? Math.round(quota.updated_at * 1000) : currentTime;
      const dtSec = Math.floor((currentTime - updatedAtMs) / 1000);
      const isLive = dtSec < 25;

      const activeProvider = requestedProvider ?? currentActiveProvider;

      const engineUsage: EngineUsage = {
        activeProvider,
        antigravity: {
          model: quota?.model_name ?? "gemini-3.8-flash-high",
          usedTokens,
          limit: maxTokens,
          percentage,
          rpm,
          rpmLimit: 60,
          tpm,
          tpmLimit: 4000000,
          dailyReqs,
          dailyLimit: quota?.daily_limit ?? 1500,
        },
        opencode: {
          model: "claude-3.7-sonnet",
          usedTokens: Math.round(usedTokens * 0.42),
          limit: 200000,
          percentage: Math.min(100, Number(((usedTokens * 0.42 / 200000) * 100).toFixed(1))),
          costUsd: Number((costUsd * 0.65).toFixed(2)),
          sessionTurns: Math.max(1, Math.round(dailyReqs * 0.15)),
          status: "ready",
        },
      };

      return {
        context: {
          usedTokens,
          maxTokens,
          percentage,
          costUsd,
          throughputTps: tps,
          sparkline: [...sparklineHistory],
        },
        radar: {
          windowSec: 60,
          currentTps: tps,
          events: radarEvents,
        },
        subagents: {
          status: "idle",
          activeCount: 0,
          description: "Agents spawned by task calls show up here, live.",
        },
        status: {
          badge: "extension",
          indicator: isLive ? "active" : "idle",
          provider: activeProvider,
          ticker: updatedAtMs.toString(),
        },
        engineUsage,
      };
    },

    recordToolCall(category: ToolCategory, durationMs = 250) {
      recordedEvents.push({
        timestamp: Date.now(),
        category: category === "empty" || category === "system" ? "read" : category,
        intensity: Math.min(1, Math.max(0.4, durationMs / 1000)),
      });
    },
  };
}
