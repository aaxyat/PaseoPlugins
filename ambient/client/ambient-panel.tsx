import {
  type PluginWorkspacePanelProps,
  useRpc,
} from "@getpaseo/plugin/client";
import { Icon } from "@getpaseo/plugin/client/react-native";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { ambientTelemetryRpc, ambientTriggerManagerRpc } from "../shared/ambient.ts";
import { ContextGaugeWidget } from "./widgets/context-gauge.tsx";
import { AgentRadarWidget } from "./widgets/agent-radar.tsx";
import { SubagentsWidget } from "./widgets/subagents-widget.tsx";
import { StatusWidget } from "./widgets/status-widget.tsx";
import { EngineUsageWidget } from "./widgets/engine-usage-widget.tsx";
import { FONT_SIZE, FONT_WEIGHT, MONO } from "./design-tokens.ts";

export interface AmbientPanelProps {
  theme: { colors: Record<string, string> };
  layout: { compact: boolean; platform?: string };
  workspaceId?: string;
  agentId?: string;
}

export function AmbientPanel({
  theme,
  layout,
  workspaceId,
  agentId,
}: AmbientPanelProps) {
  const getTelemetry = useRpc(ambientTelemetryRpc);
  const triggerManager = useRpc(ambientTriggerManagerRpc);

  const { data, isLoading } = useQuery({
    queryKey: ["ambient", "telemetry", workspaceId ?? "global", agentId ?? "default"],
    queryFn: () => getTelemetry({ workspaceId: workspaceId || undefined, agentId: agentId || undefined }),
    refetchInterval: 3000,
  });

  const colors = useMemo(() => {
    return {
      foreground: theme.colors.foreground ?? "#f8fafc",
      foregroundMuted: theme.colors.foregroundMuted ?? "#94a3b8",
      border: theme.colors.border ?? "rgba(255, 255, 255, 0.08)",
      surface: theme.colors.surface1 ?? "rgba(255, 255, 255, 0.03)",
      surface0: theme.colors.surface0 ?? "#0b0f17",
      accent: theme.colors.accent ?? "#4ade80",
    };
  }, [theme]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface0 }}>
      {/* Top Header Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: layout.compact ? 12 : 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: FONT_SIZE.header,
            fontWeight: FONT_WEIGHT.semibold,
            color: colors.foreground,
            fontFamily: MONO,
          }}
        >
          ambient
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Branches"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Icon name="GitFork" size={16} color={colors.foregroundMuted} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close panel"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Icon name="X" size={16} color={colors.foregroundMuted} />
          </Pressable>
        </View>
      </View>

      {/* Main Content Area */}
      {isLoading && !data ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : data ? (
        <ScrollView
          contentContainerStyle={{
            padding: layout.compact ? 12 : 16,
            gap: 12,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <ContextGaugeWidget data={data.context} colors={colors} />
          <EngineUsageWidget data={data.engineUsage} colors={colors} />
          <SubagentsWidget
            data={data.subagents}
            colors={colors}
            onOpenManager={() => triggerManager({ workspaceId })}
          />
          <StatusWidget data={data.status} colors={colors} />
          <AgentRadarWidget data={data.radar} colors={colors} />
        </ScrollView>
      ) : null}
    </View>
  );
}
