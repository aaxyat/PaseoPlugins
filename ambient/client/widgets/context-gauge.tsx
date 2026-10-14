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
    <AmbientCard backgroundColor={colors.surface} borderColor={colors.border}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <CircularGauge
          percentage={data.percentage}
          size={60}
          strokeWidth={5}
          accentColor="#4ade80"
          textColor={colors.foreground}
        />
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            style={{
              fontSize: FONT_SIZE.header,
              fontWeight: FONT_WEIGHT.semibold,
              color: colors.foreground,
              fontFamily: MONO,
            }}
          >
            {(data.usedTokens / 1000).toFixed(1)}k / {(data.maxTokens / 1000000).toFixed(2)}M
          </Text>
          <Text
            style={{
              fontSize: FONT_SIZE.label,
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
          marginVertical: 2,
        }}
      />

      {/* Sparkline & Throughput */}
      <View style={{ gap: 6 }}>
        <Sparkline data={data.sparkline} height={28} color="#4ade80" />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted }}>
            throughput
          </Text>
          <Text
            style={{
              fontSize: FONT_SIZE.caption,
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
