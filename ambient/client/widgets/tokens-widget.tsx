import { Icon } from "@getpaseo/plugin/client/react-native";
import { View, Text } from "react-native";
import type { TokensUsage } from "../../shared/ambient.ts";
import { AmbientCard, Badge } from "../ui.tsx";
import { FONT_SIZE, FONT_WEIGHT, MONO, RADIUS } from "../design-tokens.ts";

function formatTokens(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toLocaleString();
}

function formatCost(usd: number): string {
  if (usd < 0.01 && usd > 0) return "<$0.01";
  return `$${usd.toFixed(2)}`;
}

export function TokensWidget({
  data,
  colors,
}: {
  data: TokensUsage;
  colors: {
    foreground: string;
    foregroundMuted: string;
    border: string;
    surface: string;
    accent: string;
  };
}) {
  return (
    <AmbientCard
      backgroundColor={colors.surface}
      borderColor={colors.border}
      style={{ padding: 14, gap: 12 }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon name="Coins" size={16} color="#eab308" />
          <Text
            style={{
              fontSize: FONT_SIZE.header,
              fontWeight: FONT_WEIGHT.semibold,
              color: colors.foreground,
            }}
          >
            tokens
          </Text>
        </View>
        <Badge
          label={`${data.cacheHitRatio.toFixed(1)}% cache hit`}
          backgroundColor="rgba(74, 222, 128, 0.12)"
          color="#4ade80"
        />
      </View>

      {/* Token Breakdown Grid */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
          {/* Total Input Tokens */}
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderRadius: RADIUS.badge,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.caption,
                color: colors.foregroundMuted,
                fontFamily: MONO,
                marginBottom: 2,
              }}
            >
              total input
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.body,
                fontWeight: FONT_WEIGHT.bold,
                color: colors.foreground,
                fontFamily: MONO,
              }}
            >
              {formatTokens(data.totalInputTokens)}
            </Text>
          </View>

          {/* Cache Hit Tokens */}
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderRadius: RADIUS.badge,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.caption,
                color: colors.foregroundMuted,
                fontFamily: MONO,
                marginBottom: 2,
              }}
            >
              cache hit
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.body,
                fontWeight: FONT_WEIGHT.bold,
                color: "#4ade80",
                fontFamily: MONO,
              }}
            >
              {formatTokens(data.cacheHitTokens)}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
          {/* Output Tokens */}
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderRadius: RADIUS.badge,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.caption,
                color: colors.foregroundMuted,
                fontFamily: MONO,
                marginBottom: 2,
              }}
            >
              output tokens
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.body,
                fontWeight: FONT_WEIGHT.bold,
                color: colors.foreground,
                fontFamily: MONO,
              }}
            >
              {formatTokens(data.outputTokens)}
            </Text>
          </View>

          {/* Cache Hit Ratio */}
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderRadius: RADIUS.badge,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.caption,
                color: colors.foregroundMuted,
                fontFamily: MONO,
                marginBottom: 2,
              }}
            >
              cache ratio
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.body,
                fontWeight: FONT_WEIGHT.bold,
                color: "#38bdf8",
                fontFamily: MONO,
              }}
            >
              {data.cacheHitRatio.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Real API Cost (No Subscription) Callout */}
      <View
        style={{
          backgroundColor: "rgba(234, 179, 8, 0.06)",
          borderRadius: RADIUS.badge,
          borderWidth: 1,
          borderColor: "rgba(234, 179, 8, 0.22)",
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 2 }}>
            <Text
              style={{
                fontSize: FONT_SIZE.caption,
                fontWeight: FONT_WEIGHT.semibold,
                color: "#facc15",
              }}
            >
              API cost without subscription
            </Text>
            <Text style={{ fontSize: 10, color: colors.foregroundMuted }}>
              standard un-cached pay-as-you-go rate
            </Text>
          </View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: FONT_WEIGHT.bold,
              color: "#facc15",
              fontFamily: MONO,
            }}
          >
            {formatCost(data.rawApiCostUsd)}
          </Text>
        </View>
      </View>
    </AmbientCard>
  );
}
