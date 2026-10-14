import { Icon } from "@getpaseo/plugin/client/react-native";
import { View, Text } from "react-native";
import type { AmbientTelemetryOutput } from "../../shared/ambient.ts";
import { AmbientCard, Badge } from "../ui.tsx";
import { FONT_SIZE, FONT_WEIGHT, MONO, AMBIENT_COLORS, RADIUS } from "../design-tokens.ts";

export function AgentRadarWidget({
  data,
  colors,
}: {
  data: AmbientTelemetryOutput["radar"];
  colors: { foreground: string; foregroundMuted: string; border: string; surface: string };
}) {
  const getCategoryColor = (cat: "read" | "find" | "edit" | "bash") => {
    return AMBIENT_COLORS[cat];
  };

  return (
    <AmbientCard backgroundColor={colors.surface} borderColor={colors.border}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon name="Target" size={16} color="#34d399" />
          <Text style={{ fontSize: FONT_SIZE.title, fontWeight: FONT_WEIGHT.medium, color: colors.foreground }}>
            agent radar
          </Text>
        </View>
        <Badge label="last 60s" backgroundColor="rgba(255, 255, 255, 0.07)" color={colors.foregroundMuted} />
      </View>

      {/* Radar Bars Visualization */}
      <View style={{ height: 60, justifyContent: "flex-end", paddingVertical: 4 }}>
        <View
          style={{
            height: 48,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingHorizontal: 8,
          }}
        >
          {data.events.map((ev) => (
            <View
              key={ev.id}
              style={{
                width: 6,
                height: Math.max(16, Math.round(ev.intensity * 46)),
                backgroundColor: getCategoryColor(ev.category),
                borderRadius: RADIUS.tile,
                opacity: 0.9,
              }}
            />
          ))}
        </View>
      </View>

      {/* Timeline Markers */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted, fontFamily: MONO }}>
          -60s
        </Text>
        <Text
          style={{
            fontSize: FONT_SIZE.caption,
            fontWeight: FONT_WEIGHT.bold,
            color: "#4ade80",
            fontFamily: MONO,
          }}
        >
          {data.currentTps} t/s
        </Text>
        <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted, fontFamily: MONO }}>
          now
        </Text>
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingTop: 4,
          flexWrap: "wrap",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: AMBIENT_COLORS.read }} />
          <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted }}>read</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: AMBIENT_COLORS.find }} />
          <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted }}>find</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: AMBIENT_COLORS.edit }} />
          <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted }}>edit</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: AMBIENT_COLORS.bash }} />
          <Text style={{ fontSize: FONT_SIZE.caption, color: colors.foregroundMuted }}>bash</Text>
        </View>
      </View>
    </AmbientCard>
  );
}
