export type AnalyticsScope = "organization" | "user";

export type AnalyticsRole = "owner" | "manager" | "agent";

export type AnalyticsDateRange =
  | "today"
  | "7d"
  | "30d"
  | "90d"
  | "this_year"
  | "custom";

export type AnalyticsComparison =
  | "previous_period"
  | "previous_year"
  | "none";

export type AnalyticsBreakdownDimension =
  | "industry"
  | "source"
  | "department"
  | "position"
  | "company"
  | "priority"
  | "status"
  | "assigned_member"
  | "preferred_contact_time"
  | "gender"
  | "social_channel";

export interface AnalyticsBreakdownRow {
  dimension: string;
  leads: number;
  contacts: number;
  active: number;
  customers: number;
  wonDeals: number;
  wonRevenue: number;
}

export interface AnalyticsBreakdown {
  available: boolean;
  reason?: string;
  dimension: AnalyticsBreakdownDimension;
  rows: AnalyticsBreakdownRow[];
}

export interface AnalyticsFilters {
  range: AnalyticsDateRange;
  startDate?: string;
  endDate?: string;
  comparison: AnalyticsComparison;
  memberId?: string;
  source?: string;
  dimension?: AnalyticsBreakdownDimension;
}

export interface AnalyticsMetric {
  value: number;
  available: boolean;
  reason?: string;
}

export interface AnalyticsMetricWithComparison
  extends AnalyticsMetric {
  previousValue?: number;
  change?: number;
  changePercent?: number;
}

export interface AnalyticsOverview {
  totalLeads: AnalyticsMetricWithComparison;
  totalContacts: AnalyticsMetricWithComparison;
  totalCustomers: AnalyticsMetricWithComparison;
  totalDeals: AnalyticsMetricWithComparison;
  pipelineValue: AnalyticsMetricWithComparison;
  wonRevenue: AnalyticsMetricWithComparison;
}

export interface SalesStageMetric {
  stage: string;
  count: number;
  value: number;
}

export interface SalesAnalytics {
  available: boolean;
  reason?: string;
  stages: SalesStageMetric[];
  totalValue: number;
  totalDeals: number;
}

export interface LeadStatusMetric {
  status: string;
  count: number;
}

export interface LeadAnalytics {
  available: boolean;
  reason?: string;
  statuses: LeadStatusMetric[];
  totalLeads: number;
}

export interface ContactCustomerAnalytics {
  available: boolean;
  reason?: string;
  contacts: {
    total: number;
  };
  customers: {
    total: number;
  };
}

export interface ActivityTypeMetric {
  type: string;
  count: number;
}

export interface ActivityAnalytics {
  available: boolean;
  reason?: string;
  types: ActivityTypeMetric[];
  totalActivities: number;
}

export interface TeamMemberAnalytics {
  memberId: string;
  profileId: string;
  name: string;
  leads: number;
  contacts: number;
  customers: number;
  deals: number;
  openDeals: number;
  pipelineValue: number;
  tasks: number;
}

export interface TeamAnalytics {
  available: boolean;
  reason?: string;
  members: TeamMemberAnalytics[];
}

export interface TaskStatusMetric {
  status: string;
  count: number;
}

export interface TaskAnalytics {
  available: boolean;
  reason?: string;
  statuses: TaskStatusMetric[];
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface CRMHealthAnalytics {
  available: boolean;
  reason?: string;
  totalRecords: number;
  archivedRecords: number;
  deletedRecords: number;
  recordsMissingOwner: number;
  recordsMissingContactInfo: number;
}

export interface FunnelStageMetric {
  stage: string;
  count: number;
}

export interface FunnelAnalytics {
  available: boolean;
  reason?: string;
  stages: FunnelStageMetric[];
}

export interface CohortMetric {
  cohort: string;
  customers: number;
}

export interface CohortAnalytics {
  available: boolean;
  reason?: string;
  cohorts: CohortMetric[];
}

export interface ConversionTimeAnalytics {
  available: boolean;
  reason?: string;
}

export interface RevenueAnalytics {
  available: boolean;
  reason?: string;
  totalRevenue: number;
  wonDeals: number;
  averageDealValue: number;
  revenueByStage: {
    stage: string;
    value: number;
    count: number;
  }[];
}

export interface ForecastAnalytics {
  available: boolean;
  reason?: string;
}

export interface AttributionAnalytics {
  available: boolean;
  reason?: string;
}

export interface EngagementAnalytics {
  available: boolean;
  reason?: string;
  totalActivities: number;
  byType: {
    type: string;
    count: number;
  }[];
}

export interface AnomalyAnalytics {
  available: boolean;
  reason?: string;
}

export interface AnalyticsData {
  scope: AnalyticsScope;
  role: AnalyticsRole;
  filters: AnalyticsFilters;
  overview: AnalyticsOverview;
  sales: SalesAnalytics;
  leads: LeadAnalytics;
  contacts: ContactCustomerAnalytics;
  activity: ActivityAnalytics;
  team: TeamAnalytics;
  tasks: TaskAnalytics;
  health: CRMHealthAnalytics;
  funnel: FunnelAnalytics;
  cohorts: CohortAnalytics;
  conversionTime: ConversionTimeAnalytics;
  revenue: RevenueAnalytics;
  forecasting: ForecastAnalytics;
  attribution: AttributionAnalytics;
  engagement: EngagementAnalytics;
  anomalies: AnomalyAnalytics;
  breakdown: AnalyticsBreakdown;
}