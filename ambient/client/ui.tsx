import { Icon } from "@getpaseo/plugin/client/react-native";
import type { ReactNode } from "react";
import { View, Text, type StyleProp, type ViewStyle } from "react-native";
import { FONT_SIZE, FONT_WEIGHT, RADIUS, MONO } from "./design-tokens.ts";

export function AmbientCard({
  children,
  style,
  borderColor,
  backgroundColor,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderColor?: string;
  backgroundColor?: string;
}) {
  return (
    <View
      style={[
        {
          borderRadius: RADIUS.card,
          borderWidth: 1,
          borderColor: borderColor ?? "rgba(255, 255, 255, 0.08)",
          backgroundColor: backgroundColor ?? "rgba(255, 255, 255, 0.03)",
          padding: 14,
          gap: 12,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Badge({
  label,
  color,
  backgroundColor,
}: {
  label: string;
  color?: string;
  backgroundColor?: string;
}) {
  return (
    <View
      style={{
        borderRadius: RADIUS.badge,
        backgroundColor: backgroundColor ?? "rgba(255, 255, 255, 0.08)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          fontSize: FONT_SIZE.caption,
          fontWeight: FONT_WEIGHT.medium,
          color: color ?? "#94a3b8",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export function CircularGauge({
  percentage,
  size = 64,
  strokeWidth = 6,
  accentColor = "#4ade80",
  trackColor = "rgba(255, 255, 255, 0.08)",
  textColor = "#ffffff",
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  accentColor?: string;
  trackColor?: string;
  textColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Background track circle */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: trackColor,
        }}
      />
      {/* Active arc approximation for React Native without SVG */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: "transparent",
          borderTopColor: accentColor,
          borderRightColor: percentage > 25 ? accentColor : "transparent",
          borderBottomColor: percentage > 50 ? accentColor : "transparent",
          borderLeftColor: percentage > 75 ? accentColor : "transparent",
          transform: [{ rotate: "-45deg" }],
        }}
      />
      <Text
        style={{
          fontSize: FONT_SIZE.small,
          fontWeight: FONT_WEIGHT.bold,
          color: textColor,
          fontFamily: MONO,
        }}
      >
        {percentage.toFixed(1)}%
      </Text>
    </View>
  );
}

export function Sparkline({
  data,
  height = 36,
  color = "#4ade80",
}: {
  data: number[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...data, 1);
  return (
    <View
      style={{
        height,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 3,
        paddingTop: 4,
      }}
    >
      {data.map((val, idx) => {
        const barHeight = Math.max(4, Math.round((val / max) * (height - 6)));
        return (
          <View
            key={idx}
            style={{
              flex: 1,
              height: barHeight,
              backgroundColor: color,
              borderRadius: 2,
              opacity: 0.6 + (idx / data.length) * 0.4,
            }}
          />
        );
      })}
    </View>
  );
}

export function StatusDot({
  color = "#4ade80",
  size = 8,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
}
