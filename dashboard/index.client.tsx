import type {
  PluginClientContext,
  PluginScreenProps,
  PluginSidebarItemProps,
} from "@getpaseo/plugin/client";
import { SidebarRow } from "@getpaseo/plugin/client/ui";
import { DashboardPanel } from "./client/dashboard-panel.tsx";
import { contributeHeaderButtons } from "./client/header-button.ts";

function DashboardSidebarRow({ currentScreen, openScreen }: PluginSidebarItemProps) {
  return (
    <SidebarRow
      icon="Gauge"
      label="Dashboard"
      active={currentScreen?.screenId === "dashboard"}
      onPress={() => openScreen({ screenId: "dashboard" })}
    />
  );
}

function DashboardScreen(props: PluginScreenProps) {
  return <DashboardPanel {...props} />;
}

export { DashboardSidebarRow, DashboardScreen };
export const AmbientSidebarRow = DashboardSidebarRow;
export const AmbientScreen = DashboardScreen;

export default function contribute(client: PluginClientContext) {
  // 1. Workspace Window Header Button (Top titlebar next to Activity/VS Code)
  const stopHeaderButtons = contributeHeaderButtons(client);
  // 1. Full Screen & Main Sidebar Icon (Left navigation rail)
  client.addScreen({
    id: "dashboard",
    title: "Dashboard",
    Component: DashboardScreen,
  });
  client.addSidebarHeaderItem({
    id: "dashboard",
    title: "Dashboard",
    Component: DashboardSidebarRow,
  });

  // 2. Workspace & Explorer Panel Tab (Sidebar Explorer tabs)
  client.addWorkspacePanel({
    id: "dashboard",
    title: "dashboard",
    icon: "Gauge",
    context: "workspace",
    locations: ["explorer", "workspace"],
    Component: DashboardPanel,
  });

  // 3. Agent Workspace Panel Tab (Agent conversation tabs)
  client.addWorkspacePanel({
    id: "dashboard-agent",
    title: "dashboard",
    icon: "Gauge",
    context: "agent",
    locations: ["workspace", "explorer"],
    Component: DashboardPanel,
  });

  // 4. Command Center Items
  client.addCommandCenterItem({
    id: "open-dashboard-workspace",
    title: "Dashboard",
    icon: "Gauge",
    keywords: ["dashboard", "radar", "telemetry", "context", "minimap", "throughput", "sidebar"],
    context: "workspace",
    onSelect({ openPanel }) {
      openPanel("dashboard", { location: "explorer" });
    },
  });

  client.addCommandCenterItem({
    id: "open-dashboard-global",
    title: "Dashboard",
    icon: "Gauge",
    keywords: ["dashboard", "radar", "telemetry", "context", "minimap", "throughput", "sidebar"],
    context: "global",
    onSelect({ openScreen }) {
      openScreen({ screenId: "dashboard" });
    },
  });

  return () => {
    stopHeaderButtons();
    console.log("[dashboard] client contributions unloaded");
  };
}

