import { View, Text } from "react-native";
import type { AmbientTelemetryOutput } from "../../shared/ambient.ts";
import { AmbientCard, CircularGauge, Sparkline } from "../ui.tsx";
import { FONT_SIZE, FONT_WEIGHT, MONO } from "../design-tokens.ts";

export function ContextGaugeWidget({
  data,
  colors,
}: {
  data: AmbientTelemetryOutput["context"];
  colors: { foreground: string; foregroundMuted: string; border: string; surface: string };
}) {
  return (
    <AmbientCard backgroundColor={colors.surface} borderColor={colors.border} style={{ padding: 10, gap: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <CircularGauge
          percentage={data.percentage}
          size={46}
          strokeWidth={4}
          accentColor="#4ade80"
          textColor={colors.foreground}
        />
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            style={{
              fontSize: FONT_SIZE.body,
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
