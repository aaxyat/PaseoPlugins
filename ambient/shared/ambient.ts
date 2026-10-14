import { defineRpc } from "@getpaseo/plugin";
import { z } from "zod";

export const ToolCategorySchema = z.enum(["read", "find", "edit", "bash", "empty", "system"]);
export type ToolCategory = z.infer<typeof ToolCategorySchema>;

export const RadarEventSchema = z.object({
  id: z.string(),
  offsetSec: z.number(), // -60 to 0
  category: z.enum(["read", "find", "edit", "bash"]),
  intensity: z.number().min(0).max(1), // bar height 0-1
});
export type RadarEvent = z.infer<typeof RadarEventSchema>;

export const AntigravityUsageSchema = z.object({
  model: z.string(),
  usedTokens: z.number(),
  limit: z.number(),
  percentage: z.number(),
  rpm: z.number(),
  rpmLimit: z.number(),
  tpm: z.number(),
  tpmLimit: z.number(),
  dailyReqs: z.number(),
  dailyLimit: z.number(),
});
export type AntigravityUsage = z.infer<typeof AntigravityUsageSchema>;

export const OpenCodeUsageSchema = z.object({
  model: z.string(),
  usedTokens: z.number(),
  limit: z.number(),
  percentage: z.number(),
  costUsd: z.number(),
  sessionTurns: z.number(),
  status: z.string(),
});
export type OpenCodeUsage = z.infer<typeof OpenCodeUsageSchema>;

export const EngineUsageSchema = z.object({
  activeProvider: z.enum(["antigravity", "opencode"]),
  antigravity: AntigravityUsageSchema,
  opencode: OpenCodeUsageSchema,
});
export type EngineUsage = z.infer<typeof EngineUsageSchema>;

export const AmbientTelemetryInputSchema = z.object({
  workspaceId: z.string().optional(),
  agentId: z.string().optional(),
  provider: z.enum(["antigravity", "opencode"]).optional(),
});
export type AmbientTelemetryInput = z.infer<typeof AmbientTelemetryInputSchema>;

export const AmbientTelemetryOutputSchema = z.object({
  context: z.object({
    usedTokens: z.number(),
    maxTokens: z.number(),
    percentage: z.number(),
    costUsd: z.number(),
    throughputTps: z.number(),
    sparkline: z.array(z.number()),
  }),
  radar: z.object({
    windowSec: z.number(),
    currentTps: z.number(),
    events: z.array(RadarEventSchema),
  }),
  subagents: z.object({
    status: z.enum(["idle", "running", "attention"]),
    activeCount: z.number(),
    description: z.string(),
  }),
  status: z.object({
    badge: z.string(),
    indicator: z.enum(["active", "idle", "warning"]),
    provider: z.string(),
    ticker: z.string(),
  }),
  engineUsage: EngineUsageSchema,
});
export type AmbientTelemetryOutput = z.infer<typeof AmbientTelemetryOutputSchema>;

export const ambientTelemetryRpc = defineRpc({
  name: "ambient.telemetry",
  input: AmbientTelemetryInputSchema,
  output: AmbientTelemetryOutputSchema,
});

export const ambientTriggerManagerRpc = defineRpc({
  name: "ambient.open-manager",
  input: z.object({ workspaceId: z.string().optional() }),
  output: z.object({ success: z.boolean() }),
});
