import { createContext } from "react";
import { type SidebarContextType } from "./SidebarProvider";

export const SidebarContext = createContext<SidebarContextType | null>(null);