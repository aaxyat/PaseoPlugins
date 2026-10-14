import { View, Text } from "react-native";
import type { AmbientTelemetryOutput } from "../../shared/ambient.ts";
import { AmbientCard, CircularGauge, Sparkline } from "../ui.tsx";
import { FONT_SIZE, FONT_WEIGHT, MONO } from "../design-tokens.ts";

export function ContextGaugeWidget({
  data,
  colors,
  isNarrow = false,
  isCompact = false,
}: {
  data: AmbientTelemetryOutput["context"];
  colors: { foreground: string; foregroundMuted: string; border: string; surface: string };
  isNarrow?: boolean;
  isCompact?: boolean;
}) {
  const gaugeSize = isNarrow ? 38 : (isCompact ? 44 : 48);

  return (
    <AmbientCard
      backgroundColor={colors.surface}
      borderColor={colors.border}
      style={{ padding: isNarrow ? 8 : 10, gap: isNarrow ? 6 : 8 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: isNarrow ? 8 : 12 }}>
        <CircularGauge
          percentage={data.percentage}
          size={gaugeSize}
          strokeWidth={isNarrow ? 3 : 4}
          accentColor="#4ade80"
          textColor={colors.foreground}
        />
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            style={{
              fontSize: isNarrow ? FONT_SIZE.small : FONT_SIZE.body,
              fontWeight: FONT_WEIGHT.semibold,
              color: colors.foreground,
              fontFamily: MONO,
            }}
          >
            {(data.usedTokens / 1000).toFixed(1)}k / {(data.maxTokens / 1000000).toFixed(2)}M
          </Text>
          <Text
            style={{
              fontSize: FONT_SIZE.caption,
              color: colors.foregroundMuted,
            }}
          >
            cost ${data.costUsd.toFixed(2)} · {data.throughputTps} t/s
          </Text>
        </View>
      </View>

      {/* Dotted Divider */}
      <View
        style={{
          borderBottomWidth: 1,
          borderStyle: "dashed",
          borderColor: colors.border,
          marginVertical: 1,
        }}
      />

      {/* Sparkline & Throughput (Compact) */}
      <View style={{ gap: 4 }}>
        <Sparkline data={data.sparkline} height={20} color="#4ade80" />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 10, color: colors.foregroundMuted }}>
            throughput
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: FONT_WEIGHT.bold,
              color: "#4ade80",
              fontFamily: MONO,
            }}
          >
            {data.throughputTps} t/s
          </Text>
        </View>
      </View>
    </AmbientCard>
  );
}
