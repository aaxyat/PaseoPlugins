import { Icon } from "@getpaseo/plugin/client/react-native";
import { View, Text } from "react-native";
import type { AmbientTelemetryOutput } from "../../shared/ambient.ts";
import { AmbientCard, Badge } from "../ui.tsx";
import { FONT_SIZE, FONT_WEIGHT, MONO, AMBIENT_COLORS, RADIUS } from "../design-tokens.ts";

export function AgentRadarWidget({
  data,
  colors,
  isNarrow = false,
  isCompact = false,
}: {
  data: AmbientTelemetryOutput["radar"];
  colors: { foreground: string; foregroundMuted: string; border: string; surface: string };
  isNarrow?: boolean;
  isCompact?: boolean;
}) {
  const getCategoryColor = (cat: "read" | "find" | "edit" | "bash") => {
    return AMBIENT_COLORS[cat];
  };

  return (
    <AmbientCard
      backgroundColor={colors.surface}
      borderColor={colors.border}
      style={{ padding: isNarrow ? 8 : 10, gap: isNarrow ? 4 : 6 }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: isNarrow ? 4 : 6 }}>
          <Icon name="Target" size={isNarrow ? 12 : 14} color="#34d399" />
          <Text style={{ fontSize: isNarrow ? FONT_SIZE.small : FONT_SIZE.body, fontWeight: FONT_WEIGHT.medium, color: colors.foreground }}>
            agent radar
          </Text>
        </View>
        <Badge
          label={isNarrow ? "60s" : "last 60s"}
          backgroundColor="rgba(255, 255, 255, 0.06)"
          color={colors.foregroundMuted}
        />
      </View>

      {/* Radar Bars Visualization (Compact) */}
      <View style={{ height: 32, justifyContent: "flex-end", paddingVertical: 2 }}>
        <View
          style={{
            height: 26,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingHorizontal: 6,
          }}
        >
          {data.events.map((ev) => (
            <View
              key={ev.id}
              style={{
                width: 4,
                height: Math.max(8, Math.round(ev.intensity * 24)),
                backgroundColor: getCategoryColor(ev.category),
                borderRadius: RADIUS.tile - 1,
                opacity: 0.9,
              }}
            />
          ))}
        </View>
      </View>

      {/* Timeline Markers */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 10, color: colors.foregroundMuted, fontFamily: MONO }}>
          -60s
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: FONT_WEIGHT.bold,
            color: "#4ade80",
            fontFamily: MONO,
          }}
        >
          {data.currentTps} t/s
        </Text>
        <Text style={{ fontSize: 10, color: colors.foregroundMuted, fontFamily: MONO }}>
          now
        </Text>
      </View>

      {/* Legend (Compact) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingTop: 2,
          flexWrap: "wrap",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: AMBIENT_COLORS.read }} />
          <Text style={{ fontSize: 10, color: colors.foregroundMuted }}>read</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: AMBIENT_COLORS.find }} />
          <Text style={{ fontSize: 10, color: colors.foregroundMuted }}>find</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: AMBIENT_COLORS.edit }} />
          <Text style={{ fontSize: 10, color: colors.foregroundMuted }}>edit</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: AMBIENT_COLORS.bash }} />
          <Text style={{ fontSize: 10, color: colors.foregroundMuted }}>bash</Text>
        </View>
      </View>
    </AmbientCard>
  );
}
