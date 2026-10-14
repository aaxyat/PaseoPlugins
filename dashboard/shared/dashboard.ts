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
  fiveHourLimit: z.object({
    percentage: z.number(),
    usedTokens: z.number(),
    limitTokens: z.number(),
    resetsIn: z.string(),
  }),
  weeklyLimit: z.object({
    percentage: z.number(),
    usedTokens: z.number(),
    limitTokens: z.number(),
    resetsIn: z.string(),
  }),
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

export const DashboardTelemetryInputSchema = z.object({
  workspaceId: z.string().optional(),
  agentId: z.string().optional(),
  provider: z.enum(["antigravity", "opencode"]).optional(),
});
export type DashboardTelemetryInput = z.infer<typeof DashboardTelemetryInputSchema>;
export const AmbientTelemetryInputSchema = DashboardTelemetryInputSchema;
export type AmbientTelemetryInput = DashboardTelemetryInput;

export const TokensUsageSchema = z.object({
  totalInputTokens: z.number(),
  cacheHitTokens: z.number(),
  cacheHitRatio: z.number(), // percentage e.g. 96.5
  outputTokens: z.number(),
  rawApiCostUsd: z.number(), // cost for real API calls if no subscription
  cachedApiCostUsd: z.number().optional(),
  modelName: z.string().optional(),
});
export type TokensUsage = z.infer<typeof TokensUsageSchema>;

export const DashboardTelemetryOutputSchema = z.object({
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
  tokens: TokensUsageSchema,
  status: z
    .object({
      badge: z.string(),
      indicator: z.enum(["active", "idle", "warning"]),
      provider: z.string(),
      ticker: z.string(),
    })
    .optional(),
  engineUsage: EngineUsageSchema,
});
export type DashboardTelemetryOutput = z.infer<typeof DashboardTelemetryOutputSchema>;
export const AmbientTelemetryOutputSchema = DashboardTelemetryOutputSchema;
export type AmbientTelemetryOutput = DashboardTelemetryOutput;

export const dashboardTelemetryRpc = defineRpc({
  name: "dashboard.telemetry",
  input: DashboardTelemetryInputSchema,
  output: DashboardTelemetryOutputSchema,
});
export const ambientTelemetryRpc = dashboardTelemetryRpc;

export const dashboardTriggerManagerRpc = defineRpc({
  name: "dashboard.open-manager",
  input: z.object({ workspaceId: z.string().optional() }),
  output: z.object({ success: z.boolean() }),
});
export const ambientTriggerManagerRpc = dashboardTriggerManagerRpc;
