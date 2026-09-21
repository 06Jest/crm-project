import { useState } from "react";
import { DockContext, type DockWindowState } from "./DockContext";

const MAX_WINDOWS = 2;

export function DockProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<DockWindowState[]>([]);

  const openWindow: (win: Omit<DockWindowState, "minimized">) => void = (win) => {
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === win.id);
      if (exists) {
        return [...prev.filter((w) => w.id !== win.id), { ...exists, minimized: false }];
      }

      const next = [...prev, { ...win, minimized: false }];
      if (next.length > MAX_WINDOWS) {
        return next.slice(next.length - MAX_WINDOWS);
      }
      return next;
    });
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  };

  const updateWindow = (
    id: string,
    updates: Partial<Pick<DockWindowState, "x" | "y" | "width" | "height">>
  ) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      )
    );
  };

  const focusWindow = (id: string) => {
    setWindows((prev) => {
      const maxZIndex = Math.max(
        ...prev.map((window) => window.zIndex ?? 0),
        0
      );

      return prev.map((window) =>
        window.id === id
          ? { ...window, zIndex: maxZIndex + 1 }
          : window
      );
    });
  };

  return (
    <DockContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        toggleMinimize,
        updateWindow,
        focusWindow,
      }}
    >
      {children}
    </DockContext.Provider>
  );
}