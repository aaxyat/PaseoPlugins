import { Icon } from "@getpaseo/plugin/client/react-native";
import { View, Text } from "react-native";
import type { AmbientTelemetryOutput, ToolCategory } from "../../shared/ambient.ts";
import { AmbientCard } from "../ui.tsx";
import { FONT_SIZE, FONT_WEIGHT, MONO, AMBIENT_COLORS, RADIUS } from "../design-tokens.ts";

export function MinimapWidget({
  data,
  colors,
}: {
  data: AmbientTelemetryOutput["minimap"];
  colors: { foreground: string; foregroundMuted: string; border: string; surface: string };
}) {
  const getTileColor = (cat: ToolCategory) => {
    switch (cat) {
      case "edit":
        return "#a3e635"; // soft lime green
      case "read":
        return "#38d9f5"; // cyan
      case "find":
        return "#e879f9"; // pink/magenta
      case "bash":
        return "#f59e0b"; // amber/orange
      case "system":
        return "#64748b";
      case "empty":
      default:
        return "#293548"; // dark tile
    }
  };

  return (
    <AmbientCard backgroundColor={colors.surface} borderColor={colors.border}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon name="PanelsTopLeft" size={16} color={colors.foregroundMuted} />
        <Text style={{ fontSize: FONT_SIZE.title, fontWeight: FONT_WEIGHT.medium, color: colors.foreground }}>
          minimap
        </Text>
      </View>

      {/* Subheader: session and count */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Icon name="Terminal" size={14} color={colors.foregroundMuted} />
          <Text style={{ fontSize: FONT_SIZE.small, color: colors.foregroundMuted, fontFamily: MONO }}>
            session
          </Text>
        </View>
        <Text style={{ fontSize: FONT_SIZE.small, color: colors.foregroundMuted, fontFamily: MONO }}>
          {data.sessionCount}
        </Text>
      </View>

      {/* 10-column Tile Grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "flex-start",
          paddingVertical: 4,
        }}
      >
        {data.tiles.map((tile) => (
          <View
            key={tile.index}
            style={{
              width: 22,
              height: 22,
              borderRadius: RADIUS.tile,
              backgroundColor: getTileColor(tile.category),
              opacity: tile.category === "empty" ? 0.35 : 0.9,
            }}
          />
        ))}
      </View>
    </AmbientCard>
  );
}
