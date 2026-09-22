import { apiClient } from "./apiClient";
import type { DashboardData } from "../types/dashboard";

export const fetchDashboardAPI = async (): Promise<DashboardData> => {
  const result = await apiClient("/api/dashboard", {
    method: "GET",
  });

  return result.data as DashboardData;
};