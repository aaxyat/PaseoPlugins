import { Platform } from "react-native";

declare const window: any;
declare const document: any;
declare const navigator: any;
declare const KeyboardEvent: any;
declare const MouseEvent: any;

/**
 * Collapses the Paseo Explorer sidebar.
 * Only runs in web/Electron runtime where DOM APIs are available.
 */
export function collapseExplorerSidebar(): void {
  if (Platform.OS !== "web" || typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  // 1. First attempt: click the dedicated explorer-close button rendered by Paseo
  const closeBtn =
    document.querySelector?.('[data-testid="explorer-close"]') ||
    document.getElementById?.("explorer-close") ||
    document.querySelector?.('[data-testid="workspace-explorer-toggle"]') ||
    document.querySelector?.('[aria-label="Close Explorer sidebar"]') ||
    document.querySelector?.('button[aria-label*="close" i][aria-label*="explorer" i]');

  if (closeBtn && typeof closeBtn.click === "function") {
    try {
      if (typeof MouseEvent !== "undefined") {
        closeBtn.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      }
      closeBtn.click();
      return;
    } catch (e) {
      console.warn("[dashboard] error clicking explorer close button", e);
    }
  }

  // 2. Second attempt: Check if sidebar is currently expanded before dispatching shortcut
  const sidebar = document.querySelector?.('[data-testid="workspace-explorer-sidebar"]');
  const isExpanded = sidebar ? sidebar.getBoundingClientRect().width > 30 : true;

  if (isExpanded) {
    try {
      const isMac =
        typeof navigator !== "undefined" &&
        /Mac|iPod|iPhone|iPad/.test(navigator.platform ?? "");

      if (typeof KeyboardEvent !== "undefined") {
        const keyEvent = new KeyboardEvent("keydown", {
          key: "e",
          code: "KeyE",
          keyCode: 69,
          which: 69,
          ctrlKey: !isMac,
          metaKey: isMac,
          altKey: false,
          shiftKey: false,
          bubbles: true,
          cancelable: true,
        });

        window.dispatchEvent(keyEvent);
        document.dispatchEvent(keyEvent);
      }
    } catch (e) {
      console.warn("[dashboard] error dispatching explorer collapse shortcut", e);
    }
  }
}
