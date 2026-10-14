import {
  type PluginWorkspacePanelProps,
  useRpc,
} from "@getpaseo/plugin/client";
import { Icon } from "@getpaseo/plugin/client/react-native";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { dashboardTelemetryRpc, dashboardTriggerManagerRpc } from "../shared/dashboard.ts";
import { ContextGaugeWidget } from "./widgets/context-gauge.tsx";
import { AgentRadarWidget } from "./widgets/agent-radar.tsx";
import { SubagentsWidget } from "./widgets/subagents-widget.tsx";
import { TokensWidget } from "./widgets/tokens-widget.tsx";
import { EngineUsageWidget } from "./widgets/engine-usage-widget.tsx";
import { FONT_SIZE, FONT_WEIGHT, MONO } from "./design-tokens.ts";
import {
  useDashboardVisibility,
  setDashboardVisible,
} from "./dashboard-visibility.ts";

export interface DashboardPanelProps {
  theme: { colors: Record<string, string> };
  layout: { compact: boolean; platform?: string };
  workspaceId?: string;
  agentId?: string;
}
export type AmbientPanelProps = DashboardPanelProps;

export function DashboardPanel({
  theme,
  layout,
  workspaceId,
  agentId,
}: DashboardPanelProps) {
  const getTelemetry = useRpc(dashboardTelemetryRpc);
  const triggerManager = useRpc(dashboardTriggerManagerRpc);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "telemetry", workspaceId ?? "global", agentId ?? "default"],
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

  const [panelWidth, setPanelWidth] = useState<number>(300);
  const isVisible = useDashboardVisibility(workspaceId ?? "global");

  if (!isVisible) {
    return null;
  }

  const isNarrow = panelWidth < 280;
  const isCompact = panelWidth < 340 || layout.compact;
  const isWide = panelWidth >= 480;

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.surface0 }}
      onLayout={(e) => {
        const w = Math.round(e.nativeEvent.layout.width);
        if (w > 0 && Math.abs(w - panelWidth) > 2) {
          setPanelWidth(w);
        }
      }}
    >
      {/* Top Header Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: isNarrow ? 8 : (isCompact ? 12 : 16),
          paddingVertical: isNarrow ? 8 : 12,
          borderBottomWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: isNarrow ? FONT_SIZE.body : FONT_SIZE.header,
            fontWeight: FONT_WEIGHT.semibold,
            color: colors.foreground,
            fontFamily: MONO,
          }}
        >
          dashboard
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: isNarrow ? 8 : 12 }}>
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
            onPress={() => setDashboardVisible(workspaceId ?? "global", false)}
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
            padding: isNarrow ? 8 : (isCompact ? 12 : 16),
            gap: isNarrow ? 8 : 12,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <ContextGaugeWidget
            data={data.context}
            colors={colors}
            isNarrow={isNarrow}
            isCompact={isCompact}
          />
          <EngineUsageWidget
            data={data.engineUsage}
            colors={colors}
            isNarrow={isNarrow}
            isCompact={isCompact}
          />
          <TokensWidget
            data={data.tokens}
            colors={colors}
            isNarrow={isNarrow}
            isCompact={isCompact}
            isWide={isWide}
          />
          <SubagentsWidget
            data={data.subagents}
            colors={colors}
            isNarrow={isNarrow}
            isCompact={isCompact}
            onOpenManager={() => triggerManager({ workspaceId })}
          />
          <AgentRadarWidget
            data={data.radar}
            colors={colors}
            isNarrow={isNarrow}
            isCompact={isCompact}
          />
        </ScrollView>
      ) : null}
    </View>
  );
}

export const AmbientPanel = DashboardPanel;
