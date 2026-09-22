import { apiClient } from "./apiClient";
import type {
  AnalyticsData,
  AnalyticsFilters,
} from "../types/analytics";

export const fetchAnalyticsAPI = async (
  filters: AnalyticsFilters,
): Promise<AnalyticsData> => {
  const params = new URLSearchParams();

  params.set("range", filters.range);
  params.set("comparison", filters.comparison);

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }

  if (filters.memberId) {
    params.set("memberId", filters.memberId);
  }

  if (filters.source) {
    params.set("source", filters.source);
  }

  if (filters.dimension) {
    params.set("dimension", filters.dimension);
  }

  const result = await apiClient(`/api/analytics?${params.toString()}`, {
    method: "GET",
  });

  return result.data as AnalyticsData;
};