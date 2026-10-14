import type { PluginClientContext } from "@getpaseo/plugin/client";
import { AmbientPanel } from "./client/ambient-panel.tsx";

export default function contribute(client: PluginClientContext) {
  // Register workspace & explorer panel
  client.addWorkspacePanel({
    id: "ambient",
    title: "ambient",
    icon: "Activity",
    context: "workspace",
    locations: ["explorer", "workspace"],
    Component: AmbientPanel,
  });

  // Register Command Center item (Cmd+K / Ctrl+K)
  client.addCommandCenterItem({
    id: "open-ambient",
    title: "Ambient Telemetry",
    icon: "Activity",
    keywords: ["ambient", "radar", "telemetry", "context", "minimap", "throughput", "sidebar"],
    context: "workspace",
    onSelect({ openPanel }) {
      openPanel("ambient", { location: "explorer" });
    },
  });

  return () => {
    console.log("[ambient] client contributions unloaded");
  };
}
