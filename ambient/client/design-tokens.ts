import { Platform, type TextStyle, type ViewStyle } from "react-native";

export const MONO = Platform.select({ ios: "Menlo", default: "monospace" });

export const FONT_SIZE = {
  badge: 10,
  caption: 11,
  label: 12,
  small: 13,
  body: 14,
  title: 15,
  header: 16,
  metric: 18,
  percentage: 16,
} as const;

export const FONT_WEIGHT = {
  regular: "normal",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const satisfies Record<string, TextStyle["fontWeight"]>;

export const RADIUS = {
  tile: 4,
  badge: 6,
  control: 8,
  card: 14,
  full: 9999,
} as const;

export const AMBIENT_COLORS = {
  read: "#38d9f5",
  find: "#c084fc",
  edit: "#4ade80",
  bash: "#fbbf24",
  empty: "#22272e",
  system: "#64748b",
  sparklineGlow: "#4ade80",
} as const;
