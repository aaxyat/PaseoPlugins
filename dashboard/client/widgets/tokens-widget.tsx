import { Icon } from "@getpaseo/plugin/client/react-native";
import { View, Text } from "react-native";
import type { TokensUsage } from "../../shared/dashboard.ts";
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
  isNarrow = false,
  isCompact = false,
  isWide = false,
}: {
  data: TokensUsage;
  colors: {
    foreground: string;
    foregroundMuted: string;
    border: string;
    surface: string;
    accent: string;
  };
  isNarrow?: boolean;
  isCompact?: boolean;
  isWide?: boolean;
}) {
  const badgeLabel = isNarrow
    ? `${data.cacheHitRatio.toFixed(0)}% cached`
    : `${data.cacheHitRatio.toFixed(1)}% cache hit`;

  const statItemStyle = {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: RADIUS.badge,
    paddingHorizontal: isNarrow ? 6 : 10,
    paddingVertical: isNarrow ? 6 : 8,
    borderWidth: 1,
    borderColor: colors.border,
  };

  const statLabelStyle = {
    fontSize: isNarrow ? 9 : FONT_SIZE.caption,
    color: colors.foregroundMuted,
    fontFamily: MONO,
    marginBottom: 2,
  };

  const statValueSize = isNarrow ? 12 : FONT_SIZE.body;

  return (
    <AmbientCard
      backgroundColor={colors.surface}
      borderColor={colors.border}
      style={{ padding: isNarrow ? 10 : (isCompact ? 12 : 14), gap: isNarrow ? 8 : 12 }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: isNarrow ? 6 : 8 }}>
          <Icon name="Coins" size={isNarrow ? 14 : 16} color="#eab308" />
          <Text
            style={{
              fontSize: isNarrow ? FONT_SIZE.body : FONT_SIZE.header,
              fontWeight: FONT_WEIGHT.semibold,
              color: colors.foreground,
            }}
          >
            tokens
          </Text>
        </View>
        <Badge
          label={badgeLabel}
          backgroundColor="rgba(74, 222, 128, 0.12)"
          color="#4ade80"
        />
      </View>

      {/* Token Breakdown Grid */}
      <View style={{ gap: isNarrow ? 6 : 8 }}>
        {isWide ? (
          /* Wide 4-column row */
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
            <View style={statItemStyle}>
              <Text style={statLabelStyle}>total input</Text>
              <Text style={{ fontSize: statValueSize, fontWeight: FONT_WEIGHT.bold, color: colors.foreground, fontFamily: MONO }}>
                {formatTokens(data.totalInputTokens)}
              </Text>
            </View>
            <View style={statItemStyle}>
              <Text style={statLabelStyle}>cache hit</Text>
              <Text style={{ fontSize: statValueSize, fontWeight: FONT_WEIGHT.bold, color: "#4ade80", fontFamily: MONO }}>
                {formatTokens(data.cacheHitTokens)}
              </Text>
            </View>
            <View style={statItemStyle}>
              <Text style={statLabelStyle}>output tokens</Text>
              <Text style={{ fontSize: statValueSize, fontWeight: FONT_WEIGHT.bold, color: colors.foreground, fontFamily: MONO }}>
                {formatTokens(data.outputTokens)}
              </Text>
            </View>
            <View style={statItemStyle}>
              <Text style={statLabelStyle}>cache ratio</Text>
              <Text style={{ fontSize: statValueSize, fontWeight: FONT_WEIGHT.bold, color: "#38bdf8", fontFamily: MONO }}>
                {data.cacheHitRatio.toFixed(1)}%
              </Text>
            </View>
          </View>
        ) : (
          /* 2x2 grid */
          <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: isNarrow ? 6 : 8 }}>
              <View style={statItemStyle}>
                <Text style={statLabelStyle}>total input</Text>
                <Text style={{ fontSize: statValueSize, fontWeight: FONT_WEIGHT.bold, color: colors.foreground, fontFamily: MONO }}>
                  {formatTokens(data.totalInputTokens)}
                </Text>
              </View>
              <View style={statItemStyle}>
                <Text style={statLabelStyle}>cache hit</Text>
                <Text style={{ fontSize: statValueSize, fontWeight: FONT_WEIGHT.bold, color: "#4ade80", fontFamily: MONO }}>
                  {formatTokens(data.cacheHitTokens)}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: isNarrow ? 6 : 8 }}>
              <View style={statItemStyle}>
                <Text style={statLabelStyle}>output tokens</Text>
                <Text style={{ fontSize: statValueSize, fontWeight: FONT_WEIGHT.bold, color: colors.foreground, fontFamily: MONO }}>
                  {formatTokens(data.outputTokens)}
                </Text>
              </View>
              <View style={statItemStyle}>
                <Text style={statLabelStyle}>cache ratio</Text>
                <Text style={{ fontSize: statValueSize, fontWeight: FONT_WEIGHT.bold, color: "#38bdf8", fontFamily: MONO }}>
                  {data.cacheHitRatio.toFixed(1)}%
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Real API Cost (No Subscription) Callout */}
      <View
        style={{
          backgroundColor: "rgba(234, 179, 8, 0.06)",
          borderRadius: RADIUS.badge,
          borderWidth: 1,
          borderColor: "rgba(234, 179, 8, 0.22)",
          paddingHorizontal: isNarrow ? 8 : 12,
          paddingVertical: isNarrow ? 8 : 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 2, flex: 1 }}>
            <Text
              style={{
                fontSize: isNarrow ? 11 : FONT_SIZE.caption,
                fontWeight: FONT_WEIGHT.semibold,
                color: "#facc15",
              }}
            >
              {isNarrow ? "API cost without sub" : "API cost without subscription"}
            </Text>
            <Text style={{ fontSize: isNarrow ? 9 : 10, color: colors.foregroundMuted }}>
              {isNarrow ? "standard API rate" : "standard un-cached pay-as-you-go rate"}
            </Text>
          </View>
          <Text
            style={{
              fontSize: isNarrow ? 15 : 17,
              fontWeight: FONT_WEIGHT.bold,
              color: "#facc15",
              fontFamily: MONO,
              marginLeft: 8,
            }}
          >
            {formatCost(data.rawApiCostUsd)}
          </Text>
        </View>
      </View>
    </AmbientCard>
  );
}
