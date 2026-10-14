import { useEffect, useState } from "react";

const visibilityByWorkspace = new Map<string, boolean>();
const listeners = new Set<(workspaceId: string, visible: boolean) => void>();

export function isDashboardVisible(workspaceId: string = "global"): boolean {
  return visibilityByWorkspace.get(workspaceId) ?? true;
}

export function setDashboardVisible(workspaceId: string = "global", visible: boolean): void {
  visibilityByWorkspace.set(workspaceId, visible);
  for (const listener of listeners) {
    try {
      listener(workspaceId, visible);
    } catch (e) {
      console.warn("[ambient] visibility listener error", e);
    }
  }
}

export function toggleDashboardVisible(workspaceId: string = "global"): boolean {
  const current = isDashboardVisible(workspaceId);
  const next = !current;
  setDashboardVisible(workspaceId, next);
  return next;
}

export function watchDashboardVisibility(
  listener: (workspaceId: string, visible: boolean) => void,
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDashboardVisibility(workspaceId: string = "global"): boolean {
  const [visible, setVisible] = useState(() => isDashboardVisible(workspaceId));

  useEffect(() => {
    setVisible(isDashboardVisible(workspaceId));
    return watchDashboardVisibility((wId, nextVisible) => {
      if (wId === workspaceId || wId === "global") {
        setVisible(nextVisible);
      }
    });
  }, [workspaceId]);

  return visible;
}
