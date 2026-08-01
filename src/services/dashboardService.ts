import { apiClient } from "./apiClient";

import type {
  DashboardOverview,
  LeadMetrics,
  DealMetrics,
  CustomerMetrics,
  ActivityMetrics,
  DashboardTrends,
  ActivityItem,
  UserPerformanceMetrics,
  TrendInterval,
} from "../types/dashboard";

export const fetchDashboardOverviewAPI =
  async (): Promise<DashboardOverview> => {

    const result = await apiClient(
      "/api/dashboard/overview",
      {
        method: "GET",
      }
    );

    return result.data as DashboardOverview;

  };

export const fetchLeadMetricsAPI =
  async (): Promise<LeadMetrics> => {

    const result = await apiClient(
      "/api/dashboard/lead-metrics",
      {
        method: "GET",
      }
    );

    return result.data as LeadMetrics;

  };

export const fetchDealMetricsAPI =
  async (): Promise<DealMetrics> => {

    const result = await apiClient(
      "/api/dashboard/deal-metrics",
      {
        method: "GET",
      }
    );

    return result.data as DealMetrics;

  };

export const fetchCustomerMetricsAPI =
  async (): Promise<CustomerMetrics> => {

    const result = await apiClient(
      "/api/dashboard/customer-metrics",
      {
        method: "GET",
      }
    );

    return result.data as CustomerMetrics;

  };

export const fetchActivityMetricsAPI =
  async (): Promise<ActivityMetrics> => {

    const result = await apiClient(
      "/api/dashboard/activity-metrics",
      {
        method: "GET",
      }
    );

    return result.data as ActivityMetrics;

  };

export const fetchDashboardTrendsAPI =
  async (
    interval: TrendInterval = "day",
    daysBack = 30
  ): Promise<DashboardTrends> => {

    const result = await apiClient(
      `/api/dashboard/trends?interval=${interval}&daysBack=${daysBack}`,
      {
        method: "GET",
      }
    );

    return result.data as DashboardTrends;

  };

export const fetchRecentDashboardActivitiesAPI =
  async (
    limit = 10
  ): Promise<ActivityItem[]> => {

    const result = await apiClient(
      `/api/dashboard/recent-activities?limit=${limit}`,
      {
        method: "GET",
      }
    );

    return result.data as ActivityItem[];

  };

export const fetchUserPerformanceMetricsAPI =
  async (): Promise<UserPerformanceMetrics> => {

    const result = await apiClient(
      "/api/dashboard/user-performance",
      {
        method: "GET",
      }
    );

    return result.data as UserPerformanceMetrics;

  };