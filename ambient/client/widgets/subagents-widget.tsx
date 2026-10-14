import { Icon } from "@getpaseo/plugin/client/react-native";
import { View, Text, Pressable } from "react-native";
import type { AmbientTelemetryOutput } from "../../shared/ambient.ts";
import { AmbientCard, Badge } from "../ui.tsx";
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from "../design-tokens.ts";

export function SubagentsWidget({
  data,
  colors,
  onOpenManager,
}: {
  data: AmbientTelemetryOutput["subagents"];
  colors: { foreground: string; foregroundMuted: string; border: string; surface: string };
  onOpenManager?: () => void;
}) {
  return (
    <AmbientCard backgroundColor={colors.surface} borderColor={colors.border}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon name="Bot" size={16} color="#38d9f5" />
          <Text style={{ fontSize: FONT_SIZE.title, fontWeight: FONT_WEIGHT.medium, color: colors.foreground }}>
            subagents
          </Text>
        </View>
        <Badge
          label={data.status}
          backgroundColor="rgba(255, 255, 255, 0.07)"
          color={colors.foregroundMuted}
        />
      </View>

      {/* Description */}
      <Text style={{ fontSize: FONT_SIZE.label, color: colors.foregroundMuted, lineHeight: 18 }}>
        {data.description}
      </Text>

      {/* Open Manager Action Button */}
      <Pressable
        accessibilityRole="button"
        onPress={onOpenManager}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.control,
          paddingVertical: 10,
          backgroundColor: pressed ? "rgba(255, 255, 255, 0.06)" : "transparent",
        })}
      >
        <Icon name="Package" size={14} color={colors.foregroundMuted} />
        <Text style={{ fontSize: FONT_SIZE.small, fontWeight: FONT_WEIGHT.medium, color: colors.foreground }}>
          open manager
        </Text>
      </Pressable>
    </AmbientCard>
  );
}
