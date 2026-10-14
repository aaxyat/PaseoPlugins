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
  height = 8,
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
    <AmbientCard backgroundColor={colors.surface} borderColor={colors.border} style={{ padding: 16, gap: 14 }}>
      {/* Header with Switcher */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon name={isAntigravity ? "Zap" : "Code"} size={18} color={isAntigravity ? "#38d9f5" : "#c084fc"} />
          <Text style={{ fontSize: FONT_SIZE.header, fontWeight: FONT_WEIGHT.semibold, color: colors.foreground }}>
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
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: RADIUS.badge - 1,
              backgroundColor: isAntigravity ? "rgba(255, 255, 255, 0.18)" : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.small,
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
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: RADIUS.badge - 1,
              backgroundColor: !isAntigravity ? "rgba(255, 255, 255, 0.18)" : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.small,
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
        <View style={{ gap: 14 }}>
          {/* Active Model Tag */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: FONT_SIZE.body, color: colors.foregroundMuted }}>model</Text>
            <Badge label={agData.model} backgroundColor="rgba(56, 217, 245, 0.14)" color="#38d9f5" />
          </View>

          {/* 5-Hour Limit Bar */}
          <View style={{ gap: 6, paddingTop: 2 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: FONT_SIZE.small, fontWeight: FONT_WEIGHT.medium, color: colors.foreground }}>
                  5-hour limit
                </Text>
                <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted }}>
                  (resets in {agData.fiveHourLimit.resetsIn})
                </Text>
              </View>
              <Text style={{ fontSize: FONT_SIZE.body, fontWeight: FONT_WEIGHT.bold, color: "#38d9f5", fontFamily: MONO }}>
                {agData.fiveHourLimit.percentage}%
              </Text>
            </View>
            <ProgressBar
              percentage={agData.fiveHourLimit.percentage}
              color="#38d9f5"
              height={6}
            />
          </View>

          {/* Weekly Limit Bar */}
          <View style={{ gap: 6, paddingTop: 2 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: FONT_SIZE.small, fontWeight: FONT_WEIGHT.medium, color: colors.foreground }}>
                  weekly limit
                </Text>
                <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted }}>
                  (resets in {agData.weeklyLimit.resetsIn})
                </Text>
              </View>
              <Text style={{ fontSize: FONT_SIZE.body, fontWeight: FONT_WEIGHT.bold, color: "#c084fc", fontFamily: MONO }}>
                {agData.weeklyLimit.percentage}%
              </Text>
            </View>
            <ProgressBar
              percentage={agData.weeklyLimit.percentage}
              color="#c084fc"
              height={6}
            />
          </View>
        </View>
      )}

      {/* OpenCode View */}
      {!isAntigravity && (
        <View style={{ gap: 14 }}>
          {/* Active Model Tag */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: FONT_SIZE.body, color: colors.foregroundMuted }}>model</Text>
            <Badge label={ocData.model} backgroundColor="rgba(192, 132, 252, 0.14)" color="#c084fc" />
          </View>

          {/* OpenCode Session Metrics */}
          <View style={{ gap: 8, paddingTop: 4 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZE.body, color: colors.foregroundMuted }}>
                session cost
              </Text>
              <Text style={{ fontSize: FONT_SIZE.body, fontWeight: FONT_WEIGHT.bold, color: colors.foreground, fontFamily: MONO }}>
                ${ocData.costUsd.toFixed(2)}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZE.body, color: colors.foregroundMuted }}>
                session turns
              </Text>
              <Text style={{ fontSize: FONT_SIZE.body, fontWeight: FONT_WEIGHT.bold, color: colors.foreground, fontFamily: MONO }}>
                {ocData.sessionTurns} turns
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: FONT_SIZE.body, color: colors.foregroundMuted }}>
                status
              </Text>
              <Badge label={ocData.status} backgroundColor="rgba(74, 222, 128, 0.14)" color="#4ade80" />
            </View>
          </View>
        </View>
      )}
    </AmbientCard>
  );
}
