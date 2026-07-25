import { useContext } from "react";
import { DockContext } from "../context/DockContext";

export default function useDock() {
  const ctx = useContext(DockContext);
  if (!ctx) throw new Error("useDock must be used within a DockProvider");
  return ctx;
}