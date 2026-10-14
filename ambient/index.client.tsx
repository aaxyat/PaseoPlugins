import type {
  PluginClientContext,
  PluginScreenProps,
  PluginSidebarItemProps,
} from "@getpaseo/plugin/client";
import { SidebarRow } from "@getpaseo/plugin/client/ui";
import { AmbientPanel } from "./client/ambient-panel.tsx";
import { contributeHeaderButtons } from "./client/header-button.ts";

function AmbientSidebarRow({ currentScreen, openScreen }: PluginSidebarItemProps) {
  return (
    <SidebarRow
      icon="Gauge"
      label="Ambient"
      active={currentScreen?.screenId === "ambient"}
      onPress={() => openScreen({ screenId: "ambient" })}
    />
  );
}

function AmbientScreen(props: PluginScreenProps) {
  return <AmbientPanel {...props} />;
}

export default function contribute(client: PluginClientContext) {
  // 1. Workspace Window Header Button (Top titlebar next to Activity/VS Code)
  const stopHeaderButtons = contributeHeaderButtons(client);
  // 1. Full Screen & Main Sidebar Icon (Left navigation rail)
  client.addScreen({
    id: "ambient",
    title: "Ambient",
    Component: AmbientScreen,
  });
  client.addSidebarHeaderItem({
    id: "ambient",
    title: "Ambient",
    Component: AmbientSidebarRow,
  });

  // 2. Workspace & Explorer Panel Tab (Sidebar Explorer tabs)
  client.addWorkspacePanel({
    id: "ambient",
    title: "ambient",
    icon: "Activity",
    context: "workspace",
    locations: ["explorer", "workspace"],
    Component: AmbientPanel,
  });

  // 3. Agent Workspace Panel Tab (Agent conversation tabs)
  client.addWorkspacePanel({
    id: "ambient-agent",
    title: "ambient",
    icon: "Activity",
    context: "agent",
    locations: ["workspace", "explorer"],
    Component: AmbientPanel,
  });

  // 4. Command Center Items
  client.addCommandCenterItem({
    id: "open-ambient-workspace",
    title: "Ambient",
    icon: "Activity",
    keywords: ["ambient", "radar", "telemetry", "context", "minimap", "throughput", "sidebar"],
    context: "workspace",
    onSelect({ openPanel }) {
      openPanel("ambient", { location: "explorer" });
    },
  });

  client.addCommandCenterItem({
    id: "open-ambient-global",
    title: "Ambient",
    icon: "Activity",
    keywords: ["ambient", "radar", "telemetry", "context", "minimap", "throughput", "sidebar"],
    context: "global",
    onSelect({ openScreen }) {
      openScreen({ screenId: "ambient" });
    },
  });

  return () => {
    stopHeaderButtons();
    console.log("[ambient] client contributions unloaded");
  };
}
