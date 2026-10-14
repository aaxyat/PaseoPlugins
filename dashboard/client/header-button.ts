import type { PluginButtonRegistration, PluginClientContext } from "@getpaseo/plugin/client";
import {
  isDashboardVisible,
  setDashboardVisible,
  watchDashboardVisibility,
} from "./dashboard-visibility.ts";

type WorkspacesApi = PluginClientContext["paseo"]["workspaces"];
type ListResult = Awaited<ReturnType<WorkspacesApi["list"]>>;

const BUTTON_ID = "dashboard";
const PANEL_ID = "dashboard";
const PAGE_LIMIT = 200;

/**
 * Contributes a header button for each workspace to toggle the Dashboard.
 * Clicking once opens and activates the dashboard; clicking again hides it.
 */
export function contributeHeaderButtons(
  client: PluginClientContext,
  intervalMs = 15_000,
): () => void {
  const workspaces = client.paseo.workspaces;
  const buttons = new Map<string, PluginButtonRegistration>();
  const report = (error: unknown) =>
    console.error("[dashboard] workspace directory failed", error);

  let disposed = false;
  let connecting = false;
  let generation = 0;
  let release: (() => Promise<void>) | undefined;

  function add(workspaceId: string) {
    if (disposed || buttons.has(workspaceId)) return;

    const currentVisible = isDashboardVisible(workspaceId);

    buttons.set(
      workspaceId,
      client.addHeaderButton({
        id: BUTTON_ID,
        workspaceId,
        button: {
          title: currentVisible ? "Hide Dashboard" : "Dashboard",
          icon: "Gauge",
          behavior: {
            kind: "action",
            onPress() {
              const currentlyVisible = isDashboardVisible(workspaceId);
              if (currentlyVisible) {
                // Clicked again while open -> Hide dashboard
                setDashboardVisible(workspaceId, false);
                try {
                  client.openPanel("files", { workspaceId, location: "explorer" });
                } catch {
                  // ignore if files panel is not openable via rpc
                }
              } else {
                // Clicked while hidden -> Activate and open dashboard
                setDashboardVisible(workspaceId, true);
                client.openPanel(PANEL_ID, { workspaceId, location: "explorer" });
              }
            },
          },
        },
      }),
    );
  }

  function remove(workspaceId: string) {
    buttons.get(workspaceId)?.remove();
    buttons.delete(workspaceId);
  }

  async function read(first?: ListResult) {
    const run = ++generation;
    try {
      const ids = new Set<string>();
      let page = first ?? (await workspaces.list({ page: { limit: PAGE_LIMIT } }));
      for (let pages = 0; ; pages++) {
        if (disposed || run !== generation) return;
        for (const workspace of page.entries) ids.add(workspace.id);
        if (!page.pageInfo.hasMore) break;
        if (!page.pageInfo.nextCursor || pages >= 99)
          throw new Error("Incomplete workspace pagination");
        page = await workspaces.list({
          page: { limit: PAGE_LIMIT, cursor: page.pageInfo.nextCursor },
        });
      }
      for (const id of [...buttons.keys()]) {
        if (!ids.has(id)) remove(id);
      }
      for (const id of ids) {
        add(id);
      }
    } catch (error) {
      if (!disposed && run === generation) report(error);
    }
  }

  async function connect() {
    if (disposed || connecting || release) return;
    connecting = true;
    try {
      const result = await workspaces.list({
        page: { limit: PAGE_LIMIT },
        subscribe: {},
      });
      if (disposed) {
        await result.subscription.release();
        return;
      }
      release = () => result.subscription.release();
      result.subscription.subscribe({
        snapshot: (page) => {
          void read(page);
        },
        update: (message) => {
          if (disposed || message.type !== "workspace_update") return;
          const update = message.payload;
          if (update.kind === "upsert") add(update.workspace.id);
          else remove(update.id);
        },
        error: (error) => {
          if (disposed) return;
          report(error);
          const stop = release;
          release = undefined;
          if (stop) void stop().catch(report);
          void read();
        },
      });
    } catch (error) {
      if (!disposed) {
        report(error);
        await read();
      }
    } finally {
      connecting = false;
    }
  }

  const timer = setInterval(() => {
    if (!release) void connect();
    else void read();
  }, intervalMs);
  void connect();

  const stopVisibility = watchDashboardVisibility((workspaceId, visible) => {
    buttons.get(workspaceId)?.update({
      title: visible ? "Hide Dashboard" : "Dashboard",
    });
  });

  return () => {
    disposed = true;
    ++generation;
    clearInterval(timer);
    stopVisibility();
    const stop = release;
    release = undefined;
    if (stop) void stop().catch(report);
    buttons.forEach((button) => button.remove());
    buttons.clear();
  };
}
