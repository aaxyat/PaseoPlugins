import { View, Text } from "react-native";
import type { AmbientTelemetryOutput } from "../../shared/ambient.ts";
import { AmbientCard, Badge, StatusDot } from "../ui.tsx";
import { FONT_SIZE, FONT_WEIGHT, MONO } from "../design-tokens.ts";

export function StatusWidget({
  data,
  colors,
}: {
  data: AmbientTelemetryOutput["status"];
  colors: { foreground: string; foregroundMuted: string; border: string; surface: string };
}) {
  return (
    <AmbientCard backgroundColor={colors.surface} borderColor={colors.border}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <StatusDot color="#4ade80" size={8} />
          <Text style={{ fontSize: FONT_SIZE.title, fontWeight: FONT_WEIGHT.medium, color: colors.foreground }}>
            status
          </Text>
        </View>
        <Badge
          label={data.badge}
          backgroundColor="rgba(255, 255, 255, 0.07)"
          color={colors.foregroundMuted}
        />
      </View>

      {/* Status Details */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: FONT_SIZE.label, color: colors.foregroundMuted, fontFamily: MONO }}>
            magic-context
          </Text>
          <Text style={{ fontSize: FONT_SIZE.label, color: colors.foreground, fontFamily: MONO }}>
            {data.magicContext}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: FONT_SIZE.label, color: colors.foregroundMuted, fontFamily: MONO }}>
            ticker
          </Text>
          <Text style={{ fontSize: FONT_SIZE.label, color: colors.foreground, fontFamily: MONO }}>
            {data.ticker}
          </Text>
        </View>
      </View>
    </AmbientCard>
  );
}
