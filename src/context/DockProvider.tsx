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

  return (
    <DockContext.Provider value={{ windows, openWindow, closeWindow, toggleMinimize }}>
      {children}
    </DockContext.Provider>
  );
}