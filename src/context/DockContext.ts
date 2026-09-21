import { createContext } from "react";
import type { ElementType } from "react";

export interface DockWindowState {
  id: string;
  title: string;
  Icon?: ElementType;
  minimized?: boolean;
  minimizedIndex?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  zIndex?: number;
}

export interface DockContextType {
  windows: DockWindowState[];
  openWindow: (win: Omit<DockWindowState, "minimized">) => void;
  closeWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  updateWindow: (
    id: string,
    updates: Partial<Pick<DockWindowState, "x" | "y" | "width" | "height">>
  ) => void;
  focusWindow: (id: string) => void;
}

export const DockContext = createContext<DockContextType | undefined>(undefined);