import { Icon } from "@getpaseo/plugin/client/react-native";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { EngineUsage } from "../../shared/ambient.ts";
import { AmbientCard, Badge } from "../ui.tsx";
import { FONT_SIZE, FONT_WEIGHT, MONO, RADIUS } from "../design-tokens.ts";

function ProgressBar({
  percentage,
  color = "#4ade80",
  trackColor = "rgba(255, 255, 255, 0.08)",
  height = 5,
}: {
  percentage: number;
  color?: string;
  trackColor?: string;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(100, percentage));
  return (
    <View
      style={{
        width: "100%",
        height,
        borderRadius: height / 2,
        backgroundColor: trackColor,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${clamped}%`,
          height: "100%",
          borderRadius: height / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function EngineUsageWidget({
  data,
  colors,
}: {
  data: EngineUsage;
  colors: { foreground: string; foregroundMuted: string; border: string; surface: string; accent: string };
}) {
  const [selectedProvider, setSelectedProvider] = useState<"antigravity" | "opencode">(
    data.activeProvider,
  );

  const isAntigravity = selectedProvider === "antigravity";
  const agData = data.antigravity;
  const ocData = data.opencode;

  return (
    <AmbientCard backgroundColor={colors.surface} borderColor={colors.border}>
      {/* Header with Switcher */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon name={isAntigravity ? "Zap" : "Code"} size={16} color={isAntigravity ? "#38d9f5" : "#c084fc"} />
          <Text style={{ fontSize: FONT_SIZE.title, fontWeight: FONT_WEIGHT.medium, color: colors.foreground }}>
            {isAntigravity ? "antigravity usage" : "opencode usage"}
          </Text>
        </View>

        {/* Toggle between Antigravity and OpenCode */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            borderRadius: RADIUS.badge,
            padding: 2,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Switch to Antigravity usage"
            onPress={() => setSelectedProvider("antigravity")}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: RADIUS.badge - 1,
              backgroundColor: isAntigravity ? "rgba(255, 255, 255, 0.16)" : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.caption,
                fontWeight: isAntigravity ? FONT_WEIGHT.bold : FONT_WEIGHT.regular,
                color: isAntigravity ? colors.foreground : colors.foregroundMuted,
              }}
            >
              agy
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Switch to OpenCode usage"
            onPress={() => setSelectedProvider("opencode")}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: RADIUS.badge - 1,
              backgroundColor: !isAntigravity ? "rgba(255, 255, 255, 0.16)" : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.caption,
                fontWeight: !isAntigravity ? FONT_WEIGHT.bold : FONT_WEIGHT.regular,
                color: !isAntigravity ? colors.foreground : colors.foregroundMuted,
              }}
            >
              opencode
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Antigravity View */}
      {isAntigravity && (
        <View style={{ gap: 10 }}>
          {/* Active Model Tag */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: FONT_SIZE.label, color: colors.foregroundMuted }}>model</Text>
            <Badge label={agData.model} backgroundColor="rgba(56, 217, 245, 0.12)" color="#38d9f5" />
          </View>

          {/* Context Window Bar */}
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZE.label, color: colors.foregroundMuted, fontFamily: MONO }}>
                context window
              </Text>
              <Text style={{ fontSize: FONT_SIZE.label, color: colors.foreground, fontFamily: MONO }}>
                {(agData.usedTokens / 1000).toFixed(1)}k / {(agData.limit / 1000000).toFixed(2)}M ({agData.percentage}%)
              </Text>
            </View>
            <ProgressBar
              percentage={agData.percentage}
              color={agData.percentage < 65 ? "#4ade80" : agData.percentage < 85 ? "#fbbf24" : "#f87171"}
            />
          </View>

          {/* 5-Hour Limit Bar */}
          <View style={{ gap: 4, paddingTop: 2 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted, fontFamily: MONO }}>
                5-hour limit
              </Text>
              <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foreground, fontFamily: MONO }}>
                {agData.fiveHourLimit.percentage}% · resets in {agData.fiveHourLimit.resetsIn}
              </Text>
            </View>
            <ProgressBar
              percentage={agData.fiveHourLimit.percentage}
              color="#38d9f5"
              height={4}
            />
          </View>

          {/* Weekly Limit Bar */}
          <View style={{ gap: 4, paddingTop: 2 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted, fontFamily: MONO }}>
                weekly limit
              </Text>
              <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foreground, fontFamily: MONO }}>
                {agData.weeklyLimit.percentage}% · resets in {agData.weeklyLimit.resetsIn}
              </Text>
            </View>
            <ProgressBar
              percentage={agData.weeklyLimit.percentage}
              color="#c084fc"
              height={4}
            />
          </View>
        </View>
      )}

      {/* OpenCode View */}
      {!isAntigravity && (
        <View style={{ gap: 10 }}>
          {/* Active Model Tag */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: FONT_SIZE.label, color: colors.foregroundMuted }}>model</Text>
            <Badge label={ocData.model} backgroundColor="rgba(192, 132, 252, 0.12)" color="#c084fc" />
          </View>

          {/* Context Window Bar */}
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZE.label, color: colors.foregroundMuted, fontFamily: MONO }}>
                context window
              </Text>
              <Text style={{ fontSize: FONT_SIZE.label, color: colors.foreground, fontFamily: MONO }}>
                {(ocData.usedTokens / 1000).toFixed(1)}k / {(ocData.limit / 1000).toFixed(0)}k ({ocData.percentage}%)
              </Text>
            </View>
            <ProgressBar
              percentage={ocData.percentage}
              color="#c084fc"
            />
          </View>

          {/* OpenCode Session Metrics */}
          <View style={{ gap: 6, paddingTop: 4 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZE.label, color: colors.foregroundMuted, fontFamily: MONO }}>
                session cost
              </Text>
              <Text style={{ fontSize: FONT_SIZE.label, color: colors.foreground, fontFamily: MONO }}>
                ${ocData.costUsd.toFixed(2)}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZE.label, color: colors.foregroundMuted, fontFamily: MONO }}>
                session turns
              </Text>
              <Text style={{ fontSize: FONT_SIZE.label, color: colors.foreground, fontFamily: MONO }}>
                {ocData.sessionTurns} turns
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZE.label, color: colors.foregroundMuted, fontFamily: MONO }}>
                status
              </Text>
              <Badge label={ocData.status} backgroundColor="rgba(74, 222, 128, 0.12)" color="#4ade80" />
            </View>
          </View>
        </View>
      )}
    </AmbientCard>
  );
}
